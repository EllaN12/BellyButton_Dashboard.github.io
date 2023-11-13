// Global Variables
let metadata;
let samples;
let slicedData;
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
//​
// Fetch and process the data
d3.json(url).then(function(data) {
    metadata = data.metadata;
    console.log("metadata:", metadata);
    samples = data.samples;
    // Sort the data by sample_values descending
   sortedsamples = samples.sort((a,b) => b.sample_values - a.sample_values);
   console.log("sorted samples:", sortedsamples);
   // Slice the first 10 objects for plotting
   slicedData = sortedsamples.slice(0,10);
   console.log("slicedData:", slicedData);
//​
 // Initialize the dashboard
    init();
});

function init() {
    populateDropdown();
    updateDemographicInfo(metadata[0].id);
    updateBarCharts(samples[0].id);
    updateBubbleCharts(samples[0].id);
    optionChanged(samples[0].id);
}

    // Populates the dropdown with sample IDs
    function populateDropdown() {
        selectElement = document.getElementById("selDataset");
        samples.forEach((sample) => {
            let option = document.createElement("option");
            option.value = sample.id;
            option.text = sample.id;
            selectElement.appendChild(option);})
    };


// Updates demographic information based on the selected sample
    function updateDemographicInfo(selectedValue) {
        d3.json(url).then((data) => {
            let metadata = data.metadata;
            let resultArray = metadata.filter(
              (sampleObj) => sampleObj.id == selectedValue
            );
            let result = resultArray[0];
            let PANEL = d3.select("#sample-metadata");
        
            PANEL.html("");
            for (key in result) {
              PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
            }
          });
        }
         

// Updates the charts based on the selected sample
    function updateBarCharts(selectedValue) {
        //bar charts data based on selected valu 
        let bar_data = samples.find(sample => sample.id === selectedValue);
        let trace1= {
            y: bar_data.otu_ids.slice(0, 10).map(otu_ID => `OTU ${otu_ID}`).reverse(),
            x: bar_data.sample_values.reverse(),
            text: bar_data.otu_labels.reverse(),
            name: "OTUs",
            type: "bar",
            orientation: "h"
        };
       // Apply a title to the layout
        let layout = {
            title: "Top 10 OTUs per Individuals",
            margin: {
           l: 150,
           t: 100,
           }};
      Plotly.newPlot("bar", [trace1], layout);}
     

    function updateBubbleCharts(selectedValue) {
        let bubble_data = samples.find(sample => sample.id === selectedValue);
        let trace2 = {
            x: bubble_data.otu_ids,
            y: bubble_data.sample_values,
            mode: 'markers',
            marker: {
           size: bubble_data.sample_values,
           color: bubble_data.otu_ids,
           colorscale: bubble_data.otu_ids,
        },
           text: bubble_data.otu_labels,
           type: 'scatter'
    };
        let layout2 = {
            showlegend: true,
            height: 700,
            width: 700,};
    Plotly.newPlot('bubble', [trace2], layout2);
}
    
// Handles selection changes in the dropdown
function optionChanged(selectedValue) {
    updateDemographicInfo(selectedValue);
    updateBarCharts(selectedValue);
    updateBubbleCharts(selectedValue);}