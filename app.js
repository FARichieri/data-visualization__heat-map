const displayChart = async () => {
  await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  )
    .then((response) => response.json())
    .then((data) => {
      const { baseTemperature, monthlyVariance } = data;
      console.log({ baseTemperature });
      console.log({ monthlyVariance });
      const firstYear = monthlyVariance[0];
      const lastYear = monthlyVariance[monthlyVariance.length - 1];

      const width = 550;
      const height = 250;
      const padding = 60;

      const colors = {
        darkblue: {
          min: -Infinity,
          max: 2.8,
        },
        '#4575b4': {
          min: 2.8,
          max: 3.9,
        },
        '#74add1': {
          min: 3.9,
          max: 5.0,
        },
        '#abd9e9': {
          min: 5.0,
          max: 6.1,
        },
        '#e0f3f8': {
          min: 6.1,
          max: 7.2,
        },
        '#ffffbf': {
          min: 7.2,
          max: 8.3,
        },
        '#fee090': {
          min: 8.3,
          max: 9.5,
        },
        '#fdae61': {
          min: 9.5,
          max: 10.6,
        },
        '#f46d43': {
          min: 10.6,
          max: 11.7,
        },
        purple: {
          min: 11.7,
          max: 12.8,
        },
        red: {
          min: 12.8,
          max: Infinity,
        },
      };

      const months = [
        'December',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
      ];

      svg = d3
        .select('.container')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '.8rem')
        .text('Monthly Global Land-Surface Temperature');

      svg
        .append('text')
        .attr('id', 'description')
        .attr('x', width / 2)
        .attr('y', 34)
        .attr('text-anchor', 'middle')
        .style('font-size', '.7rem')
        .text(
          `${firstYear.year} - ${lastYear.year}: base temperature ${baseTemperature}℃`
        );

      const xScale = d3
        .scaleTime()
        .domain([firstYear.year, lastYear.year])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleBand()
        .domain(d3.range(12))
        .rangeRound([padding, height - padding]);

      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.format('d'))
        .ticks(20)
        .tickSize(10, 1);

      const yAxis = d3
        .axisLeft(yScale)
        .tickValues(yScale.domain())
        .tickFormat((month) => {
          const date = new Date(0);
          date.setUTCMonth(month);
          const format = d3.timeFormat('%B');
          return format(date);
        })
        .tickSize(10, 1);

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis)
        .attr('font-size', '.3rem');
      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding},0)`)
        .call(yAxis)
        .attr('font-size', '.3rem');

      svg
        .append('g')
        .attr('transform', `translate(${0},${0})`)
        .attr('id', 'map')
        .selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.month - 1))
        .attr('width', (d, i) => 2)
        .attr('height', 10)
        .attr('class', 'cell')
        .attr('data-month', (d) => d.month - 1)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => baseTemperature + d.variance)
        .attr('fill', (d) => {
          const temperature = baseTemperature + d.variance;
          for (key in colors) {
            let max = colors[key].max;
            let min = colors[key].min;
            if (temperature >= min && temperature <= max) {
              let colorMatched =
                temperature >= min && temperature <= max && key;
              return colorMatched;
            }
          }
        })
        .on('mouseover', function (d, item) {
          d3.select(this).transition().d3.duration('50').attr('opacity', '.85');
          tooltip.transition().d3.duration('50').attr('opacity', 1);
        });

      const legendWIth = width / 3;

      const colorsData = Object.entries(colors).slice(1, 10);
      const xScaleColors = d3
        .scaleBand()
        .domain(d3.range(colorsData.length))
        .range([0, legendWIth]);

      const xAxisColors = d3
        .axisBottom(xScaleColors)
        .tickFormat((d, i) => colorsData[i][1].min);

      svg
        .append('g')
        .attr('transform', `translate(${padding},${height - 15})`)
        .attr('id', 'legend')
        .append('g')
        .attr('class', 'axis-colors')
        .call(xAxisColors)
        .attr('font-size', '.3rem');

      svg
        .select('#legend')
        .append('g')
        .attr('id', 'colors')
        .selectAll('rect')
        .data(colorsData.slice(0, 8))
        .enter()
        .append('rect')
        .attr('transform', `translate(${10}, ${-9.5})`)
        .attr('x', (d, i) => xScaleColors(i))
        .attr('y', 0)
        .attr('width', legendWIth / colorsData.length)
        .attr('height', 10)
        .attr('fill', (d, i) => d[0]);
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
