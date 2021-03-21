// Populate metadata panel

function buildMetadata(id) {
  d3.json("samples.json").then((data) => {

    // Get and filter data based on ID
    var metadata = data.metadata;
    var filteredMeta = metadata.filter(sampleinfo => sampleinfo.id == id);
    var result = filteredMeta[0]
    var metaPanel = d3.select("#sample-metadata");

    // Clear existing data
    metaPanel.html("");

    // Populate panel
    Object.entries(result).forEach(([key, value]) => {
      metaPanel.append("tr").text(`${key}: ${value}`);
    });
  });
}

// Create charts

function buildCharts(id) {

// Use `d3.json` to fetch the sample data for the plots
d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var resultsSample = samples.filter(sampleinfo => sampleinfo.id == id);
  var result = resultsSample[0];

  var ids = result.otu_ids;
  var labels = result.otu_labels;
  var values = result.sample_values;


  // Bubble chart
      var BubbleData = [
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  var BubbleLayout = {
    margin: { 
      t: 0
   },
    xaxis: { title: " OTU ID" },
    hovermode: "closest",
    };

  Plotly.plot("bubble", BubbleData, BubbleLayout);

  //  Bar chart
  
  var BarData =[
    {
      // Slice the first 10 objects and reverse for plotting
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  var BarLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 100 }
  };

  Plotly.newPlot("bar", BarData, BarLayout);
});
};

// Bonus

function buildGauge(id) {
  // get wfreq data
  d3.json("samples.json").then((data) => {

    // Get and filter wfreq data based on ID
    var metadata = data.metadata;
    var filteredMeta = metadata.filter(freq => freq.id == id);
    var wfreq = filteredMeta.wfreq

    // create gauge chart
var gaugeData = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly button washing frequency <br> Scrubs per week" },
        type: "indicator",
        mode: "gauge+number",
    gauge: {
      axis: {range: [null, 9] },
      steps: [
        { range: [0, 1], color: "lightgray" },
        { range: [1, 2], color: "gray" },
        { range: [2, 3], color: "lightgray" },
        { range: [3, 4], color: "gray" },
        { range: [4, 5], color: "lightgray" },
        { range: [5, 6], color: "gray" },
        { range: [6, 7], color: "lightgray" },
        { range: [7, 8], color: "gray" },
        { range: [8, 9], color: "lightgray" }
      ]}
      }
      ];

var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
 

function init() {
// Reference to dropdown select element
var dropdownMenu  = d3.select("#selDataset");

// Populate the drop down with sample names 
d3.json("samples.json").then((data) => {
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    dropdownMenu 
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample to build first plot
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  buildGauge(firstSample);
});
}

function optionChanged(newSample) {
// Update charts and metadata when selecting new sample
buildCharts(newSample);
buildMetadata(newSample);
buildGauge(newSample);
}

// Initialize the dashboard
init();

