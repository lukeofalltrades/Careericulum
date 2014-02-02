function loadData() {
  IN.API.Profile("me")
    .fields(["id", "firstName", "lastName", "pictureUrl","headline","publicProfileUrl",'positions'])
    .result(function(result) {
      profile = result.values[0];
      drawTimeline(profile.positions.values)
      
      google.setOnLoadCallback(function(){ drawTimeline(profile.positions.values) });
      
      profHTML = "<div id='profileimage'>";
      profHTML += "<a href='" + profile.publicProfileUrl + "'>";
      profHTML += "<img class=img_border align='left' src='" + profile.pictureUrl + "'></a></div>";
      profHTML += "</div>";   
      profHTML += "<div id='name_headline'>";   
      profHTML += "<h1 class=myname><a href='" + profile.publicProfileUrl + "'>" + profile.firstName + " " + profile.lastName + "</a> </h1>";
      profHTML += "<span class='myheadline'>" + profile.headline + "</span>";
      profHTML += "</div>"; 
      profHTML += "";
      $("#dynamic_load").html(profHTML);
    });
}

function drawTimeline(positions) {
    console.log(positions)
    
    var container = document.getElementById('timeline');

      var chart = new google.visualization.Timeline(container);

      var dataTable = new google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Role' });
      dataTable.addColumn({ type: 'string', id: 'Name' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });

      $.each(positions, function( index, value ) {
          if(value.isCurrent){
              var currentTime = new Date()
              var month = currentTime.getMonth() + 1
              var day = currentTime.getDate()
              var year = currentTime.getFullYear()
              
              dataTable.addRows([
                  [ value.title,  value.company.name,  new Date(value.startDate.year, value.startDate.month, 1),  new Date(year, month, day) ]
                  ]); 
                  
           } else {
               
               dataTable.addRows([
                   [ value.title,  value.company.name,  new Date(value.startDate.year, value.startDate.month, 1),  new Date(value.endDate.year, value.endDate.month, 30) ]
                   ]); 
           }
           
      });
      chart.draw(dataTable);
}
