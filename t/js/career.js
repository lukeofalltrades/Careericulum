var url = "https://careericulum.firebaseio.com/";


$(document).ready(function() {

    var pepe = $.fn.fullpage({
        slidesColor: ['whitesmoke', '#7BAABE', '#1bbc9b', '#4BBFC3', '#ccddff'], //, '#7BAABE', '#ccddff'],
        anchors: ['profile', 'general', 'overview', 'accessors', 'next'],
        menu: '#menu',
        fixedElements: '#careericulum_logo',
        paddingTop:'60px',
        scrollOverflow: true
        //verticalCentered:false
    });


});



function loadData() {
    IN.API.Profile("me")
        .fields(["id", "firstName", "lastName", "pictureUrl", "headline", "publicProfileUrl", 'positions','educations'])
        .result(function(result) {
            

            var profile = result.values[0],
                linkedIn = new Firebase(url + profile.id + '/profile'),
                stats = new Firebase(url + profile.id + '/stats');
                
                console.log(profile);


            linkedIn.set(profile);
            drawTimeline(profile.positions.values);

            //drawEducationTimeline(profile.educations.values);

            profHTML = "<div id='profileimage'>";
            profHTML += "<a href='" + profile.publicProfileUrl + "'>";
            profHTML += "<img class=img_border src='" + profile.pictureUrl + "'></a></div>";
            profHTML += "</div>";
            profHTML += "<div id='name_headline'>";
            profHTML += "<h1 class=myname><a href='" + profile.publicProfileUrl + "'>" + profile.firstName + " " + profile.lastName + "</a> </h1>";
            profHTML += "<span class='myheadline'>" + profile.headline + "</span>";
            profHTML += "</div>";
            profHTML += "";
            $("#dynamic_load").html(profHTML);





            $('.dragger').draggable({
                containment: "#grid_items",
                //grid:[50,50],
                stop: function() {
                    var data_key = $(this).data('name'),
                        parent = $(this).parent().offset()
                        offset = $(this).offset(),
                        xPos = offset.left - parent.left,
                        yPos = offset.top - parent.top,
                        stats = new Firebase(url + profile.id + '/stats/' + data_key)
                    stats.set([xPos, yPos]);
                }


            });

            $(".dragger").each(function() {
                var data_key = $(this).data('name');
                var dataRef = new Firebase(url + profile.id + '/stats/' + data_key);
                dataRef.once('value', function(snapshot) {
                    if (snapshot.val()) {
                        var left_axis = snapshot.val()[0],
                            top_axis = snapshot.val()[1] - $("div").find("[data-name='" + data_key + "']").data('offsetheight');
                        $("div").find("[data-name='" + data_key + "']").css({
                            top: top_axis,
                            left: left_axis
                        });
                    }

                });

            });
            
            $("form.add").each(function() {
                
                var accessors_key = $(this).attr('id'),
                    parentitem = $(this).parent(),
                    accessorsRef = new Firebase(url + profile.id + '/accessors/' + accessors_key);
                    
                accessorsRef.once('value', function(snapshot) {
                    if (snapshot.val()) {
                        
                        $.each(snapshot.val(), function( index, value ) {
                            console.log('<li>'+value.name + ' (' + value.email +')</li>');
                            parentitem.find('ul').append('<li>'+value.name + ' (' + value.email +')</li>');
                        });
                    }

                });
                
                
                $(this).submit(function(e) {
                    e.preventDefault();
                    var name = $(this).find(".name_field").val(),
                        email = $(this).find(".email_field").val();

                        parentitem.find('ul').append('<li>'+name + ' (' + email +')</li>');
                        
                        accessorsRef.push({name: name, email: email});
      
                    
                    
                });

            });



        });
}

function drawTimeline(positions) {
    var container = document.getElementById('timeline'),
        chart = new google.visualization.Timeline(container),
        dataTable = new google.visualization.DataTable();

    dataTable.addColumn({
        type: 'string',
        id: 'Role'
    });
    dataTable.addColumn({
        type: 'string',
        id: 'Name'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'Start'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'End'
    });

    $.each(positions, function(index, value) {
        if (value.isCurrent) {
            var currentTime = new Date(),
                month = currentTime.getMonth() + 1,
                day = currentTime.getDate(),
                year = currentTime.getFullYear();

            dataTable.addRows([
                [value.title, value.company.name, new Date(value.startDate.year, value.startDate.month, 1), new Date(year, month, day)]
            ]);

        } else {

            dataTable.addRows([
                [value.title, value.company.name, new Date(value.startDate.year, value.startDate.month, 1), new Date(value.endDate.year, value.endDate.month, 30)]
            ]);
        }

    });
    chart.draw(dataTable);
}
function drawEducationTimeline(positions) {
    var container = document.getElementById('timeline2'),
        chart = new google.visualization.Timeline(container),
        dataTable = new google.visualization.DataTable();


    dataTable.addColumn({
        type: 'string',
        id: 'Name'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'Start'
    });
    dataTable.addColumn({
        type: 'date',
        id: 'End'
    });

    $.each(positions, function(index, value) {

            dataTable.addRows([
                [value.schoolName, new Date(value.startDate.year, 9, 1), new Date(value.endDate.year, 5, 30)]
            ]);

    });
    chart.draw(dataTable);
}