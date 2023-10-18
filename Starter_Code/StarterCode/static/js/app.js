// Global Utility Variables
var data = {};

// Global HTML selectors
var inputSelector = d3.select("#selDataset");
var panelDemoInfo = d3.select("#sample-metadata");

// Function to populate the Demographic Info panel
function populateDemoInfo(idNum) {
    var metadataFilter = data.metadata.filter(item => item.id == idNum)[0];

    // Clear the existing content
    panelDemoInfo.html("");

    // Append each key-value pair to the panel
    Object.entries(metadataFilter).forEach(([key, value]) => {
        var titleKey = key.charAt(0).toUpperCase() + key.slice(1);
        panelDemoInfo.append("h6").text(`${titleKey}: ${value}`);
    });
}

// Function to draw the bar plot
function drawBarPlot(idNum) {
    var samplesFilter = data.samples.filter(item => item.id == idNum)[0];

    var sampleValues = samplesFilter.sample_values.slice(0, 10).reverse();
    var otuIds = samplesFilter.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    var otuLabels = samplesFilter.otu_labels.slice(0, 10).reverse();

    var trace = {
        type: "bar",
        y: otuIds,
        x: sampleValues,
        text: otuLabels,
        orientation: 'h'
    };

    var traceData = [trace];

    var layout = {
        title: "Top 10 OTUs Found",
        yaxis: { title: "OTU Labels" },
        xaxis: { title: "Values" }
    };

    Plotly.newPlot("bar", traceData, layout);
}

// Function to draw the bubble chart
function drawBubbleChart(idNum) {
    var samplesFilter = data.samples.filter(item => item.id == idNum)[0];

    var trace = {
        x: samplesFilter.otu_ids,
        y: samplesFilter.sample_values,
        mode: 'markers',
        text: samplesFilter.otu_labels,
        marker: {
            color: samplesFilter.otu_ids,
            size: samplesFilter.sample_values,
            colorscale: "Earth"
        }
    };

    var traceData = [trace];

    var layout = {
        showlegend: false,
        height: 600,
        width: 1500,
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot('bubble', traceData, layout);
}

// Function to handle the dropdown menu change event
function optionChanged(idNum) {
    populateDemoInfo(idNum);
    drawBarPlot(idNum);
    drawBubbleChart(idNum);
}

// Initialization
function initialization() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (jsonData) {
        data = jsonData;
        var names = data.names;

        names.forEach(element => {
            inputSelector.append("option").text(element).property("value", element);
        });

        var idNum = names[0];
        populateDemoInfo(idNum);
        drawBarPlot(idNum);
        drawBubbleChart(idNum);
    });
}

// Call the initialization function
initialization();
