function OrderChart() {
  const {
    buy_list,
    sell_list,
    cur_pairs,
    cur_token_symbol,
    pool,
    get_price_by_point,
    switch_token,
  }: {
    buy_list: IOrderPointItem[];
    sell_list: IOrderPointItem[];
    cur_pairs: string;
    cur_token_symbol: string;
    pool: PoolInfo;
    get_price_by_point: Function;
    switch_token: ISwitchToken;
  } = useContext(LimitOrderChartData);
  console.log('buy_list', buy_list);
  console.log('sell_list', sell_list);
  const [foucsOrderPoint, setFoucsOrderPoint] = useState<IOrderPointItem>();
  const [side, setSide] = useState<ISide>();
  // 分为四档分别是：1--->[-20w 20w], 2--->[-40w 40w], 3--->[-60w 60w], 4--->[-80w 80w]
  const [zoom, setZoom] = useState<number>(2);
  const GEAR_MAP:{[key:number]: {
    left_point:number;
    right_point:number;
  }} = {
    1: { left_point: -200000, right_point:200000},
    2: { left_point: -400000, right_point:400000},
    3: { left_point: -600000, right_point:600000},
    4: { left_point: -800000, right_point:800000}
  }
  // CONST start
  const svg_width = 600;
  const svg_height = 400;
  const svg_padding = 40;
  const axisRightWidth = 60;
  const disFromHoverBoxToPointer = 20;
  // CONST end
  useEffect(() => {
    if (sell_list?.length || buy_list?.length) {
      drawChart();
    } else {
      clearChart();
    }
    console.log('333333333-sell_list', sell_list);
    console.log('333333333-buy_list', buy_list);
  }, [buy_list, sell_list, zoom]);
  function drawChart() {
    clearChart();
    const { price_range, amount_range, buy_list_new, sell_list_new } =
      get_data_for_drawing();
    // 创建一个横坐标轴
    const scaleBottom = d3
      .scaleLinear()
      .domain(price_range)
      .range([0, svg_width - svg_padding - axisRightWidth])
      .clamp(true);
    const axisBottom: any = d3.axisTop(scaleBottom).tickSize(0).tickPadding(10);
    d3.select('.axisBottom')
      .transition()
      .attr('transform', `translate(0, ${svg_height - svg_padding})`)
      .call(axisBottom)
      .selectAll('text')
      .attr('fill', '#7E8A93');
    d3.select('.axisBottom').select('.domain').attr('stroke', 'transparent');

    // 创建一个纵坐标
    const scaleRight = d3
      .scaleLinear()
      .domain(amount_range)
      .range([0, svg_height - svg_padding * 2])
      .clamp(true);
    const axisRight: any = d3.axisLeft(scaleRight).tickSize(0).tickPadding(10);
    d3.select('.axisRight')
      .transition()
      .attr('transform', `translate(${svg_width - svg_padding}, 0)`)
      .call(axisRight)
      .selectAll('text')
      .attr('fill', '#7E8A93')
      .select('.domain');
    d3.select('.axisRight').select('.domain').attr('stroke', 'transparent');

    // 面积 path data 生成器
    const areaGenerator = d3
      .area()
      .x((d: any) => {
        return +Big(scaleBottom(+d.price)).toFixed(0);
      })
      .y0(() => {
        return svg_height - svg_padding * 2;
      })
      .y1((d: any) => {
        return +Big(
          scaleRight(+(d.accumulated_x_readable || d.accumulated_y_readable))
        ).toFixed(0);
      });

    // 折线path data生成器
    const lineGenerator = d3
      .line()
      .x((d: any) => {
        return +Big(scaleBottom(+d.price)).toFixed(0);
      })
      .y((d: any) => {
        return +Big(
          scaleRight(+(d.accumulated_x_readable || d.accumulated_y_readable))
        ).toFixed(0);
      });

    // 虚线 path data 生成器
    const dashLineGenerator = d3.line();

    /** 创建左侧区域 */
    //  面积
    if (buy_list?.length) {
      const area_path_data_left = areaGenerator(buy_list_new as any);
      d3.select('.areaLeft')
        .append('path')
        .attr('opacity', '0.3')
        .attr('d', area_path_data_left)
        .attr('fill', 'url(#paint0_linear_7545_2924)');

      // 渐变色
      const max_y = buy_list_new[buy_list_new.length - 1];
      const y = +Big(
        scaleRight(
          +(max_y.accumulated_x_readable || max_y.accumulated_y_readable)
        )
      ).toNumber();
      d3.select('.greenLinearGradient')
        .attr('y1', y)
        .attr('y2', svg_height - svg_padding * 2);

      // 折线
      var line_path_data_left = lineGenerator(buy_list_new as any);
      d3.select('.areaLeft')
        .append('path')
        .attr('d', line_path_data_left)
        .attr('stroke', '#00FFD1')
        .attr('strokeWidth', '2')
        .attr('fill', 'none');

      // 触发鼠标事件的矩形区域
      const buy_list_first = buy_list_new[0];
      const buy_list_last = buy_list_new[buy_list_new.length - 1];
      d3.select('.rectLeft')
        .append('rect')
        .attr('width', () => {
          return (
            scaleBottom(+buy_list_first.price) -
            scaleBottom(+buy_list_last.price) +
            svg_padding
          );
        })
        .attr('height', () => {
          return svg_height;
        })
        .attr('x', () => {
          return scaleBottom(+buy_list_last.price) - svg_padding;
        })
        .attr('y', `${-svg_padding}`)
        .attr('fill', 'transparent')
        .on('mousemove', function (e) {
          const { offsetX, offsetY } = e;
          const list = buy_list.concat([]).reverse();
          const [targetX, targetY, targetItem] = searchNearCoordinate(
            list,
            e,
            scaleBottom,
            scaleRight
          );
          if (!isInvalid(targetX) && !isInvalid(targetY)) {
            showCrossDot({
              dashLineGenerator,
              targetX,
              targetY,
              offsetX,
              offsetY,
              dotFillColor: '#00FFD1',
            });
            setSide('buy');
            setFoucsOrderPoint(targetItem);
          }
        })
        .on('mouseleave', function (e, d) {
          hideCrossDot();
        });
    }

    /** 创建右侧区域 */
    // 面积
    if (sell_list?.length) {
      const area_path_data_right = areaGenerator(sell_list_new as any);
      d3.select('.areaRight')
        .append('path')
        .attr('opacity', '0.3')
        .attr('d', area_path_data_right)
        .attr('fill', 'url(#paint0_linear_7545_2926)');

      // 渐变色
      const max_y = sell_list_new[0];
      const y = +Big(
        scaleRight(
          +(max_y.accumulated_x_readable || max_y.accumulated_y_readable)
        )
      ).toNumber();
      d3.select('.redLinearGradient')
        .attr('y1', y)
        .attr('y2', svg_height - svg_padding * 2);

      // 折线
      const line_path_data_right = lineGenerator(sell_list_new as any);
      d3.select('.areaRight')
        .append('path')
        .attr('d', line_path_data_right)
        .attr('stroke', '#FF6A8E')
        .attr('strokeWidth', '2')
        .attr('fill', 'none');
      // 触发鼠标事件的矩形区域
      const sell_list_first = sell_list_new[0];
      const sell_list_last = sell_list_new[sell_list_new.length - 1];
      d3.select('.rectRight')
        .append('rect')
        .attr('width', () => {
          return (
            scaleBottom(+sell_list_first.price) -
            scaleBottom(+sell_list_last.price) +
            svg_padding
          );
        })
        .attr('height', () => {
          return svg_height;
        })
        .attr('x', () => {
          return scaleBottom(+sell_list_last.price);
        })
        .attr('y', `${-svg_padding}`)
        .attr('fill', 'transparent')
        .on('mousemove', function (e) {
          const { offsetX, offsetY } = e;
          const list = sell_list.concat([]).reverse();
          const [targetX, targetY, targetItem] = searchNearCoordinate(
            list,
            e,
            scaleBottom,
            scaleRight
          );
          if (!isInvalid(targetX) && !isInvalid(targetY)) {
            showCrossDot({
              dashLineGenerator,
              targetX,
              targetY,
              offsetX,
              offsetY,
              dotFillColor: '#FF6A8E',
            });
            setSide('sell');
            setFoucsOrderPoint(targetItem);
          }
        })
        .on('mouseleave', function (e, d) {
          hideCrossDot();
        });
    }
  }
  function get_data_for_drawing() {
    // 获取价格区间
    let min_price: any;
    let max_price: any;
    // todo
    const current_gear_points_range = GEAR_MAP[zoom];
    const display_buy_list = buy_list.filter((order:IOrderPointItem) => {
      return order.point >= current_gear_points_range.left_point && order.point <= current_gear_points_range.right_point
    })
    const display_sell_list = sell_list.filter((order:IOrderPointItem) => {
      return order.point >= current_gear_points_range.left_point && order.point <= current_gear_points_range.right_point
    })
    
    if (display_buy_list.length == 0) {
      min_price = Big(sell_list[sell_list.length - 1].price || 0)
        .mul(0.9)
        .toFixed();
    } else if (display_buy_list.length == 1) {
      min_price = Big(display_buy_list[0].price).mul(0.9).toFixed();
    } else {
      min_price = Big(display_buy_list[display_buy_list.length - 1].price)
        .mul(0.9)
        .toFixed();
    }
    if (display_sell_list.length == 0) {
      max_price = Big(display_buy_list[0].price || 0)
        .mul(1.1)
        .toFixed();
    } else if (display_sell_list.length == 1) {
      max_price = Big(display_sell_list[0].price).mul(1.1).toFixed();
    } else {
      max_price = Big(display_sell_list[0].price).mul(1.1).toFixed();
    }
    // 获取 数量区间
    const amounts: string[] = [];
    display_buy_list.concat(display_sell_list).forEach((item: IOrderPointItem) => {
      amounts.push(
        Big(item.accumulated_x_readable || item.accumulated_y_readable).toFixed(
          0
        )
      );
    });
    amounts.sort((b, a) => {
      return Big(b).minus(a).toNumber();
    });

    // 给绘制的图 添加辅助点
    const buy_list_new: IOrderPointItem[] = [];
    if (display_buy_list.length == 1) {
      const ele = display_buy_list[0];
      buy_list_new.push(
        {
          price: ele.price,
          accumulated_x_readable: '0',
          accumulated_y_readable: '0',
        },
        ele,
        {
          price: min_price,
          accumulated_x_readable: ele.accumulated_x_readable,
          accumulated_y_readable: ele.accumulated_y_readable,
        }
      );
    } else {
      display_buy_list.forEach((item: IOrderPointItem, index) => {
        if (index == 0) {
          buy_list_new.push({
            price: item.price,
            accumulated_x_readable: '0',
            accumulated_y_readable: '0',
          });
        }
        buy_list_new.push(item);
        const nextItem = display_buy_list[index + 1];
        if (index < display_buy_list.length - 1) {
          buy_list_new.push({
            price: nextItem.price,
            accumulated_x_readable: item.accumulated_x_readable,
            accumulated_y_readable: item.accumulated_y_readable,
          });
        }
        if (index == display_buy_list.length - 1) {
          buy_list_new.push({
            price: min_price,
            accumulated_x_readable: item.accumulated_x_readable,
            accumulated_y_readable: item.accumulated_y_readable,
          });
        }
      });
    }
    const sell_list_new: IOrderPointItem[] = [];
    if (display_sell_list.length == 1) {
      const ele = display_sell_list[0];
      sell_list_new.push(
        {
          price: max_price,
          accumulated_x_readable: ele.accumulated_x_readable,
          accumulated_y_readable: ele.accumulated_y_readable,
        },
        ele,
        {
          price: ele.price,
          accumulated_x_readable: '0',
          accumulated_y_readable: '0',
        }
      );
    } else {
      display_sell_list.forEach((item: IOrderPointItem, index) => {
        if (index == 0) {
          sell_list_new.push({
            price: max_price,
            accumulated_x_readable: item.accumulated_x_readable,
            accumulated_y_readable: item.accumulated_y_readable,
          });
        }
        if (index < display_sell_list.length - 1) {
          const nextItem = display_sell_list[index + 1];
          sell_list_new.push(item, {
            price: item.price,
            accumulated_x_readable: nextItem.accumulated_x_readable,
            accumulated_y_readable: nextItem.accumulated_y_readable,
          });
        }
        if (index == display_sell_list.length - 1) {
          sell_list_new.push(item, {
            price: item.price,
            accumulated_x_readable: '0',
            accumulated_y_readable: '0',
          });
        }
      });
    }
    const price_range: number[] = [+min_price, +max_price];
    const amount_range: number[] = [+amounts[amounts.length - 1], 0];
    return {
      price_range,
      amount_range,
      buy_list_new,
      sell_list_new,
    };
  }
  function clearChart() {
    d3.selectAll('.axisBottom *').remove();
    d3.selectAll('.axisRight *').remove();
    d3.selectAll('.areaLeft *').remove();
    d3.selectAll('.areaRight *').remove();
    d3.selectAll('.rectLeft *').remove();
    d3.selectAll('.rectRight *').remove();
    d3.select('.verticalDashLine').attr('d', '');
    d3.select('.horizontalDashLine').attr('d', '');
  }
  // 找到离这个点最近的一个数据 中文
  function searchNearCoordinate(
    list: IOrderPointItem[],
    e: any,
    scaleBottom: Function,
    scaleRight: Function
  ) {
    const { offsetX } = e;
    const x = offsetX - svg_padding;
    let targetX;
    let targetY;
    let targetItem;
    let gtIndex = list.findIndex((item: IOrderPointItem) => {
      return scaleBottom(+item.price) >= x;
    });
    if (gtIndex == -1) {
      gtIndex = list.length - 1;
    }
    const gtItem = list[gtIndex];
    const x1 = scaleBottom(+gtItem.price);
    if (gtIndex == 0) {
      targetY = scaleRight(
        +(gtItem.accumulated_x_readable || gtItem.accumulated_y_readable)
      );
      targetX = x1;
      targetItem = gtItem;
    } else {
      const ltIndex = gtIndex - 1;
      const ltItem = list[ltIndex];
      const x0 = scaleBottom(+ltItem.price);
      if (x1 - x > x - x0) {
        targetX = x0;
        targetY = scaleRight(
          +(ltItem.accumulated_x_readable || ltItem.accumulated_y_readable)
        );
        targetItem = ltItem;
      } else {
        targetX = x1;
        targetY = scaleRight(
          +(gtItem.accumulated_x_readable || gtItem.accumulated_y_readable)
        );
        targetItem = gtItem;
      }
    }
    return [targetX, targetY, targetItem];
  }
  function showCrossDot({
    dashLineGenerator,
    targetX,
    targetY,
    offsetX,
    offsetY,
    dotFillColor,
  }: {
    dashLineGenerator: Function;
    targetX: number;
    targetY: number;
    offsetX: number;
    offsetY: number;
    dotFillColor: string;
  }) {
    const pathDataX = dashLineGenerator([
      [targetX, -40],
      [targetX, 360],
    ]);
    const pathDataY = dashLineGenerator([
      [0, targetY],
      [520, targetY],
    ]);
    d3.select('.verticalDashLine').attr('d', pathDataX).attr('opacity', '1');
    d3.select('.horizontalDashLine').attr('d', pathDataY).attr('opacity', '1');
    d3.select('.dot')
      .attr('cx', targetX)
      .attr('cy', targetY)
      .attr('opacity', '1')
      .attr('fill', dotFillColor);
    d3.select('.hoverBox').attr(
      'style',
      `visibility:visible;transform:translate(${
        offsetX + disFromHoverBoxToPointer
      }px, ${offsetY - disFromHoverBoxToPointer}px)`
    );
  }
  function hideCrossDot() {
    d3.select('.verticalDashLine').attr('opacity', '0');
    d3.select('.horizontalDashLine').attr('opacity', '0');
    d3.select('.dot').attr('opacity', '0');
    d3.select('.hoverBox').attr('style', `visibility:invisible`);
  }
  return (
    <div className="relative" style={{ width: `${svg_width}px` }}>
      <svg width={`${svg_width}`} height={`${svg_height}`}>
        <g transform={`translate(${svg_padding}, ${svg_padding})`}>
          {/* 横坐标 */}
          <g className="axisBottom"></g>
          {/* 纵坐标 */}
          <g className="axisRight"></g>
          {/* 左侧面积图 */}
          <g className="areaLeft"></g>
          {/* 右侧面积图 */}
          <g className="areaRight"></g>
          {/* 左侧触发鼠标事件区域 */}
          <g className="rectLeft"></g>
          {/* 右侧触发鼠标事件区域 */}
          <g className="rectRight"></g>
          {/* 垂直 虚线 */}
          <path
            className="verticalDashLine"
            fill="none"
            stroke="#999"
            stroke-dasharray="2,2"
          ></path>
          {/* 水平 虚线 */}
          <path
            className="horizontalDashLine"
            fill="none"
            stroke="#999"
            stroke-dasharray="2,2"
          ></path>
          {/* 折线上的点 */}
          <circle
            className="dot"
            r="5"
            stroke="#0D1A23"
            stroke-width="2"
            opacity="0"
          />
        </g>
        {/* 渐变色绿色 */}
        <defs>
          <linearGradient
            className="greenLinearGradient"
            id="paint0_linear_7545_2924"
            x1="0"
            x2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#00D6AF" />
            <stop offset="1" stop-color="#00D6AF" stop-opacity="0" />
          </linearGradient>
        </defs>
        {/* 渐变色红色 */}
        <defs>
          <linearGradient
            className="redLinearGradient"
            id="paint0_linear_7545_2926"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
          >
            <stop stop-color="#FF6A8E" />
            <stop offset="1" stop-color="#FF6A8E" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* hover上去的悬浮框 */}
      <div className="hoverBox absolute px-2 py-3 invisible left-0 top-0 bg-toolTipBoxBgColor border border-toolTipBoxBorderColor rounded-md">
        <div className="flex items-center justify-between gap-5 mb-3">
          <span className="text-xs text-primaryText">Side</span>
          <span
            className={`text-sm capitalize ${
              side == 'buy' ? 'text-senderHot' : 'text-sellColorNew'
            }`}
          >
            {side}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5 mb-3">
          <span className="text-xs text-primaryText">Price({cur_pairs})</span>
          <span className="text-sm text-white">
            {formatPrice(foucsOrderPoint?.price)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5 mb-3">
          <span className="text-xs text-primaryText">
            Qty({cur_token_symbol})
          </span>
          <span className="text-sm text-white">
            {formatNumber(
              foucsOrderPoint?.amount_x_readable ||
                foucsOrderPoint?.amount_y_readable
            )}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <span className="text-xs text-primaryText whitespace-nowrap">
            Total Qty({cur_token_symbol})
          </span>
          <span className="text-sm text-white">
            {formatNumber(
              foucsOrderPoint?.accumulated_x_readable ||
                foucsOrderPoint?.accumulated_y_readable
            )}
          </span>
        </div>
      </div>
    </div>
  );
}