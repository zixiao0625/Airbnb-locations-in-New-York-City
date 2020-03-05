
/**
 * This example shows how to plot points on a map
 * and how to work with normal geographical data that
 * is not in GeoJSON form
 *
 * Outline:
 * 1. show how to load multiple files of data
 * 2. talk about how geoAlbers() is a scaling function
 * 3. show how to plot points with geoAlbers
 */

//size of the overall map
const m = {
    width: 800,
    height: 600
}

//create an svg container to contain the g container
const svg = d3.select("body").append('svg')
    .attr('width', m.width)
    .attr('height', m.height)

//title of the map
    svg.append('text')
        .attr('x', 400)
        .attr('y', 20)
        .attr('font-size','24px')
        .attr('fill','#00868B')
        .text('Airbnb locations in New York City')

//container for the map
const g = svg.append('g')

//import geoJSON data for new york
d3.json('nygeo.json').then(function(data) {

  //import airbnb data
    d3.csv('data.csv').then(function(pointData) {

      //initialize the geoAlbers scale function
        const albersProj = d3.geoAlbers()
            .scale(60000) //adjust size of the map
            .rotate([74, 0]) //googled negative longitude of new York
            .center([0, 40.7]) //googled latitude of New york
            .translate([m.width/2, m.height/2]);

        // // this code shows what albersProj really does
        // let point = pointData[0]
        // let arr = [ point['longitude'] , point['latitude'] ]
        // let scaled = albersProj(arr)
        // console.log(scaled)

        //adjust size/center of the map polygon by using the scale function
        const geoPath = d3.geoPath()
        .projection(albersProj)

        //transfer the data points of new york GeoJSON into the map polygon
        g.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
            .attr('fill', '#DCDCDC')
            .attr('stroke', 'black')
            .attr('d', geoPath)

        // plots circles on the new york map
        g.selectAll('.circle')
            .data(pointData) //use the airbnb data
            .enter()
            .append('circle')
                .attr('cx', function(d) { //set x coordinates
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[0]
                })
                .attr('cy', function(d) { //set y coordinates
                    let scaledPoints = albersProj([d['longitude'], d['latitude']])
                    return scaledPoints[1]
                })
                .attr('r', 2) //radius of circle
                .attr('fill', '#00E5EE') //color of circle
                .on( "click", function(){
                  //when the circle is clicked, make it move to the corner and disappear slowly
                d3.select(this)
                    .attr("opacity",1)
                    .transition()
                    .duration( 1000 )
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("opacity", 0 )
                    .on("end",function(){
                    d3.select(this).remove();
                    })
                })


    })

})
