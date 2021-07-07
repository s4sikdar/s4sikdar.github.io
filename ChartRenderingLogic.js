let chart_div = document.getElementById('chart_div');
// console.log('Inside Chart Rendering Logic File');
function bottom() {
      // return  document.body.offsetHeight * 
      return  ((window.innerWidth < 900) ? 35 :
            (window.innerWidth < 1000) ? 45 : 
            (window.innerWidth < 1100) ? 50 : 55);

            // ((window.innerWidth < 900) ? 0.045 :
            //  (window.innerWidth < 1000) ? 0.05 : 
            //  (window.innerWidth < 1100) ? 0.055 : 0.06);
}

function optimal_chart_area() {
      // Settings for how to draw the chart and avoid having the labels cut off. (document.body.offsetHeight * 0.1)
      var chart_area = {
            // left: (chart_div.offsetWidth * 0.1), ((window.innerWidth < 1000) ? 50 : 60) 
            top: bottom(),
            bottom: (document.body.offsetHeight * ((window.innerWidth < 1000) ? 0.0075 : 0.015)),
            // bottom: bottom(),
            width: (chart_div.offsetWidth),
            height: Math.min((document.body.offsetHeight * 0.8),
                              (chart_div.offsetWidth * 0.8))
      };
      
      // Some extra work to make sure the chart is the right size so that the chart is not
      // cutting off the labels.
      // if ((document.body.offsetWidth < 1100)) {
      // if (document.body.offsetWidth < 1000) {
            // chart_area.top = 50;
            // chart_area.bottom = Math.min((chart_div.offsetWidth * 0.01),
                                    // (document.body.offsetHeight * 0.01));
      // }
            // chart_area.left = 0;
            // chart_area.width = chart_div.offsetWidth;
      // }
      
      return chart_area;
}

function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Skill');
      data.addColumn('number', 'Slices');
      data.addColumn({type: 'string', role: 'tooltip'});
      // All the skills/slices of the pie.
      data.addRows([
            [
            'Python', 3.5,
            'Python - my \"mother tongue\" of programming languages. ' +
            'It was the first practical language I ' +
            'learned to code in, the one I made my first project in, ' +
            'and the one I\'d answer technical interviews with. It\'s ' +
            'the main language I use at work.'
            ],
            [
            'HTML, CSS, JavaScript', 3,
            'With the advice of a friend, I started to learn the basics ' +
            'of web development around mid April. I\'d say I\'ve gotten ' +
            'to be passable in it, and have gone on to learn REACTjs over ' +
            'the past winter.'
            ],
            [
            'REACTjs', 0.75,
            'I\'ve been learning the basics of REACTjs over the last couple ' +
            'of months, starting around the end of December/start of January. ' +
            'I\'m familiar with the basics of components, and I understand a little ' +
            'about state and the component lifecycle as well (not much though). ' +
            'I recreated this site in REACTjs mainly as an exercise.' 
            ],
            ['Django', 1,
            'One of the applications that I\'ve been working on at my internship is a Django ' +
            'applicaton. I\'ve done a little of a lot of things in Django - from templating, ' +
            'to model querying, to view handling functions.'
            ],
            [
            'Bootstrap', 1,
            'A friend gave me the advice of learning and using Bootstrap last fall, ' +
            'and its classes and accordion components have made this project (and web development)' +
            'a lot easier.'
            ],
            [
            'SQL/SQLite3', 0.75,
            'I took a Relational Databases course in school - Google "CS 338 UWaterloo". ' +
            'I learned the basics of SQL queries using the SQLite3 DBMS. I covered ' +
            'some basics on normal forms, relational models, and the E.R. model - but ' +
            'this was back in the summer of 2020. I\'ve since used it for one of my projects. ' +
            'I\'ve also been using the MySQL command line a little at work, mainly doing ' +
            'basic C.R.U.D. statements to check that my server-side code works correctly.'
            ],
            [
            'Git/GitHub', 0.5,
            'I learned Git at the advice of a friend, starting out by tracking ' +
            'my projects with it to save myself from having 10 copies of ' +
            'the same code in different file directories. I use Git and GitHub ' +
            'extensively at work.'
            ]
      ]);
      
      var options = {
            // No title SkillsChart 
            title: '',
            // Background color on the chart
            backgroundColor: '#F1F0EA',
            // We are trying to dynamically size the chart to take enough space
            // so that it's big enough, but the labels on the side are not cut off (mixed results right now)
            chartArea: optimal_chart_area(),
            // Labels on the side
            legend: {
            position: 'top',
            alignment: 'center',
            textStyle: {
                  color: '#353535'
            }
            },
            width: (chart_div.offsetWidth),
            // Want to take enough space up for the chart to fit, but not for the spacing to
            // be off (document.body.offsetHeight * 0.015) + (document.body.offsetHeight * 0.03))
            height: Math.round(Math.min((chart_div.offsetWidth * 0.8),(document.body.offsetHeight * 0.8))),
            pieSliceText: 'none',
            // Color for different slices
            slices: [
            {color: '#ffe4c4'},
            {color: '#e9d4b7'},
            {color: '#dfc197'},
            // {color: '#d8b27e'},
            {color: '#d0a465'},
            // {color: '#c69146'},
            {color: '#c2893a'},
            {color: '#a97833'},
            {color: '#835d27'},
            // {color: '#443014'}
            // {color: '#96856f'}
            ],
            // activated on click of the slice, and is html (can be styled with css)
            tooltip: {
                  ignoreBounds: false,
                  isHtml: true,
                  trigger: 'selection',
                  textStyle: {
                        color: '#F1F0EA'
                        // color: '#353535'
                  }
            }
      };
      
      // Played with the chart appearance at various sizes, found that these settings
      // when the window is less than 1000px is ideal
      if (document.body.offsetWidth < 1000) {
            options.legend.position = 'top';
            options.legend.alignment = 'center';
            options.height = Math.round(Math.min((chart_div.offsetWidth * 0.8), 
                                                 (document.body.offsetHeight * 0.8)));
      }
      
      var chart = new google.visualization.PieChart(chart_div);
      // google.visualization.events.addListener(chart, 'error', () => {
      //       chart_div.className = 'w-100 m-0 p-0 GoogleChartsError'
      //       console.log('An error occured with Google Charts.')
      // });
      chart.draw(data, options);
}

function SetupGoogleCharts() {
      google.charts.load('current', {packages: ['corechart']}).then(drawChart).then(function() {
            window.addEventListener('resize', function() {
                  try {
                        width = this.innerWidth;
                        // Check if thw width is enough for the chart to be redrawn, and if so then
                        // redraw it.
                        if (width >= 768) {
                          drawChart();
                        }
                  } catch(error) {
                  console.log(error);
                  }
            });
      });
}
// .then(() => {
//       window.addEventListener('resize', () => {
//             if (window.innerWidth >= 768) {
//                   drawChart();
//             }
//       });
// });

function ChartJsErrorCallback(entries, observer) {
      /*
      Google Charts are rendered on one of 2 conditions. The first is that we are in internet explorer, and
      thus the GoogleChart component is loaded. The second is that ChartJS failed. In this case setState is
      called, and the GoogleChart component is loaded. In either case, once the chart is loaded, we have the
      class of GoogleCharts. When we see this class, and this class only, we load google charts and add the
      event listener.
      */ 
      let google_charts = (entries[0].target.className.includes('GoogleCharts') &&
                          (!(entries[0].target.className.includes('GoogleChartsError'))));
      if (google_charts) {
            SetupGoogleCharts();   
      }
}


function SetUp() {
      const IE11 = Boolean(document.documentMode);
      // const IE11 = true;
      if (IE11) {
            SetupGoogleCharts();
      } else {
            let GoogleChartObserver = new MutationObserver(ChartJsErrorCallback);
            // console.log(chart_div);
            GoogleChartObserver.observe(chart_div, {attributeFilter: ['class']});
      }
}

// SetUp();
SetupGoogleCharts();