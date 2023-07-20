
// // Cargar el JSON desde un archivo
// d3.json('data.json').then(function (data) {
//     // `data` contiene el JSON cargado

//     // Utilizar `data` en lugar de `data.nodes`
//     var data.nodes = data.data.nodes;
//     var data.links = data.data.links;

//     // Resto de tu código...

// }).catch(function (error) {
//     // Manejo de errores en caso de que ocurra un problema al cargar el JSON
//     console.error('Error al cargar el JSON:', error);
// });



//diccionario de las ubicaciones por numeros arequipa=1 , lima=2
// var data.nodes = [
//     { id: 1, time: "2021-05-25 23:47:08", likes: 5, emocion: 0 , text:"PROTESTORS NEEDED 6PM-10PM DAILY (NOW). 1450 E McKinney DENTON COUNTY JAIL. Covid19 Outbreak. Released Trustee repo… https://t.co/zNAAr9CQZp" ,},
//     { id: 2, time: "2021-04-23 23:47:24", likes: 10, emocion: 1, text:"Always honored to speak w @NicolleDWallace about critical #covid19 health issues. In the midst of ⬆️infections,… https://t.co/KR7THtc1v9" ,},
//     { id: 3, time: "2021-01-22 23:47:58", likes: 10, emocion: -1, text:"Excellent partnership to prevent #COVID19, thank you Sharps Roasthouse 🌟 https://t.co/6Snd9qherl" ,},
//     { id: 4, time: "2021-10-20 23:48:04", likes: 2, emocion: 0, text:"Don't take your eye off the ball. There are still protests going on and more and more people are dying of #COVID19… https://t.co/5ilNnoplAT" ,}
// ];


// metas : 
// Borde= color=fecha 
// Emoji= representa la clasificación de tweet   



// const max_date = (data.nodes_data) => {
//     const maxDate=new Date(
//         Math.max(
//             data.nodes_data.map( element => {
//                 return new Date.parse(element.time)
//             })   
//         )
//     )
// } 

console.log(data)

//borde de color por fecha
const colorRange = ['#ff0000', '#00ff00'];
const escala_color_fecha = d3.scaleLinear()
    .domain([new Date("2020-07-24T00:00:00"), new Date("2020-07-26T23:59:59")])
    .range(colorRange);

//borde grosor depende a #likes
const likes = d3.scaleLinear()
    .domain([0, 549524])
    .range([1, 10]);

//color de la arista del lugar de presedencia 
const ubication = d3.scaleLinear()
    .domain([0, 3])
    .range(["orange", "green", "purple", "blue"]);

const width = document.querySelector("#container_d3").offsetWidth;
const height = document.querySelector("#container_d3").offsetHeight;
var svg = d3
    .select("#graph")
    .attr("width","100%")
    .attr("height","100%")
    .call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
    }));


var vis=svg.append('g');
    

const linksLayer=vis.append("g")
    .attr("id","linksLayer");
const nodesLayer=vis.append("g")
    .attr("id","nodesLayer");
/***********************************************************************/
var simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(function (d) { return d.id; }).distance(10))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

/***********************************************************************/
var link = linksLayer.selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    //forma reducida
    //función para recorrer todos los nodos con el atributo ubication 
    .style("stroke", (d) => {
        //console.log(ubication(d.ubication));
        return ubication(d.ubication);
        // return "black";
    })
    .style("stroke-width", "8px");
/***********************************************************************/
var node = nodesLayer.selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", "node");

node.append("circle")
    .attr("r", 17)
    .attr("id", (d) => d.id)
    .style("stroke", (d) => {
        return escala_color_fecha(Date.parse(d.time));
    })
    .style("stroke-width", (d) => {
        return likes(d.likes);
    })
    // .style("fill-opacity","0")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

node.append("image")
.attr("x", -11) // Half the width of the image
.attr("y", -11) // Half the height of the image
.attr("width", 22) // Width of the image
.attr("height", 22) // Height of the image
.attr("xlink:href", (d)=>{
    console.log("d.emocion",typeof d.emocion)
    if (d.emocion === 1){
        return feliz;
    }
    if (d.emocion === 0){
        return serio;
    }
    if (d.emocion === -1){
        return triste;
    }
})
.on("mouseover", handleMouseOver)
.on("mouseout", handleMouseOut);
/***********************************************************************/
simulation.on("tick", function () {
    link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    node
        .attr("transform",(d)=>{
            return 'translate('+d.x+','+d.y+')';
        })
});
/***********************************************************************/
function handleMouseOver(d, i) {
    d3.select(this)
        .transition()
        //  .duration(200)
        //  .style("fill", "#ff7f0e");
        .attr("r", 30);
    const detalles = d3.select("#detalles");
    detalles.style('opacity', 1);
    var i = this.getAttribute('index');

    console.log(this)
    detalles
        .html(
            '🐦 Tweet: <b>' + data.nodes[this.id - 1].text + '</b> <br> ❤️ Likes: <b>'+ data.nodes[this.id - 1].likes
        )
        .style('background-color', function () {
            return '#ffa600';
        });
}

function handleMouseOut(d, i) {
    d3.select(this)
        .transition()
        .attr("r", 17)
        .style("fill", "#a3a340");


    d3.select("#detalles")
        .style('opacity', 0);
    //.style('height', 20);
}