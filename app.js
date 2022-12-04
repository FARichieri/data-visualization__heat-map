const displayChart = async () => {
  await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  )
    .then((response) => response.json())
    .then((data) => {
      data.monthlyVariance.forEach(function (val) {
        val.month -= 1;
      });
      const { baseTemperature, monthlyVariance } = data;
      const firstYear = monthlyVariance[0].year;
      const lastYear = monthlyVariance[monthlyVariance.length - 1].year;

      const width = 550;
      const height = 250;
      const padding = 50;

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

      const formatDate = (month) => {
        const date = new Date();
        date.setMonth(month);
        const format = d3.timeFormat('%B');
        return format(date);
      };

      const tooltip = d3
        .select('.container')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

      svg = d3
        .select('.container')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '.7rem')
        .text('Monthly Global Land-Surface Temperature');

      svg
        .append('text')
        .attr('id', 'description')
        .attr('x', width / 2)
        .attr('y', 38)
        .attr('text-anchor', 'middle')
        .style('font-size', '.6rem')
        .text(
          `${firstYear} - ${lastYear}: base temperature ${baseTemperature}℃`
        );

      const xScale = d3
        .scaleBand()
        .domain(monthlyVariance.map((d) => d.year))
        .range([padding, width - padding]);

      const yScale = d3
        .scaleBand()
        .domain(d3.range(12))
        .range([padding, height - padding]);

      const xAxis = d3
        .axisBottom(xScale)
        .tickValues(xScale.domain().filter((year) => year % 10 === 0))
        .tickFormat((year) => {
          const date = new Date(0);
          date.setUTCFullYear(year);
          var format = d3.timeFormat('%Y');
          return format(date);
        })
        .tickSize(5, 1);

      const yAxis = d3
        .axisLeft(yScale)
        .tickFormat((month) => formatDate(month))
        .tickSize(5, 1);

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis)
        .attr('font-size', '.3rem')
        .append('text')
        .text('Years')
        .style('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2}, ${padding / 2.5})`)
        .attr('fill', 'black');

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding},0)`)
        .call(yAxis)
        .attr('font-size', '.3rem')
        .append('text')
        .text('Months')
        .style('text-anchor', 'middle')
        .attr(
          'transform',
          `translate(-${padding / 2 + 10}, ${height / 2}) rotate(-90)`
        )
        .attr('fill', 'black');

      svg
        .append('g')
        .attr('id', 'map')
        .selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', (d) => xScale(d.year) + 1)
        .attr('y', (d) => yScale(d.month))
        .attr('width', (d) => xScale.bandwidth(d.year))
        .attr('height', (d) => yScale.bandwidth(d.month))
        .attr('data-month', (d) => d.month)
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
          d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '.50')
            .attr('stroke', 'black')
            .attr('stroke-width', '0.9');
          tooltip.transition().duration(100).style('opacity', 1);
          tooltip
            .html(
              `
          ${item.year} - ${formatDate(item.month)} </br> ${parseFloat(
                (baseTemperature + item.variance).toFixed(1)
              )}°C </br> ${parseFloat(item.variance).toFixed(1)}°C
        `
            )
            .attr('data-year', item.year)
            .style('left', d.pageX + 10 + 'px')
            .style('top', d.pageY + 10 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration('50')
            .attr('opacity', '1')
            .attr('stroke', 'none');
          tooltip.transition().duration(100).style('opacity', 0);
        });

      const legendWIth = width / 4;

      const colorsData = Object.entries(colors).slice(1, 10);
      const xScaleColors = d3
        .scaleBand()
        .domain(d3.range(colorsData.length))
        .range([0, legendWIth]);

      const xAxisColors = d3
        .axisBottom(xScaleColors)
        .tickFormat((d, i) => colorsData[i][1].min)
        .tickSize(5, 1)
        .tickPadding(1.5);

      svg
        .append('g')
        .attr('transform', `translate(${padding},${height - 15})`)
        .attr('id', 'legend')
        .append('g')
        .attr('class', 'axis-colors')
        .call(xAxisColors)
        .attr('font-size', '.25rem');

      svg
        .select('#legend')
        .append('g')
        .attr('id', 'colors')
        .selectAll('rect')
        .data(colorsData.slice(0, 8))
        .enter()
        .append('rect')
        .attr('transform', `translate(${7.65}, ${-9.5})`)
        .attr('x', (d, i) => xScaleColors(i))
        .attr('y', 0)
        .attr('width', legendWIth / colorsData.length)
        .attr('height', 10)
        .attr('fill', (d, i) => d[0])
        .attr('stroke', 'black')
        .attr('stroke-width', '.2');
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
