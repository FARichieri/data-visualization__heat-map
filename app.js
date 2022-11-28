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

      const width = 600;
      const height = 280;
      const padding = 60;
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

      // const months = Array(12)
      //   .fill(0)
      //   .map((v, i) => new Date(2021, i, 1));

      svg = d3
        .select('.container')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', width / 2)
        .attr('y', padding / 1.5)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text('Monthly Global Land-Surface Temperature');

      svg
        .append('text')
        .attr('id', 'description')
        .attr('x', width / 2)
        .attr('y', padding)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .text(
          `${firstYear.year} - ${lastYear.year}: base temperature ${baseTemperature}℃`
        );

      const xScale = d3
        .scaleLinear()
        .domain([firstYear.year, lastYear.year])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleBand()
        .domain(months.reverse())
        .range([height - padding, padding]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);
      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding},0)`)
        .call(yAxis);
    })
    .then(hideLoader())
    .catch((error) => console.log(error));
};

const hideLoader = () => {
  document.getElementById('loading').style.display = 'none';
};

displayChart();
