

var url = "https://careericulum.firebaseio.com/";


$(document).ready(function() {
    
	var pepe = $.fn.fullpage({
		slidesColor: ['whitesmoke', '#1bbc9b','#4BBFC3'],//, '#7BAABE', '#ccddff'],
		anchors: ['profile', 'overview', 'next'],
		menu: '#menu'
	});
    
    
    
    
    
	
});



function loadData() {
  IN.API.Profile("me")
    .fields(["id", "firstName", "lastName", "pictureUrl","headline","publicProfileUrl",'positions'])
    .result(function(result) {
        
        profile = result.values[0];
      var linkedIn = new Firebase(url+profile.id + '/profile');
      var stats = new Firebase(url+profile.id + '/stats')
        

      linkedIn.set(profile);
      
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
      

      
      
      
      $('.dragger').draggable({ containment: "#grid_items",
              //grid:[50,50],
              stop: function(){
                  var data_key = $(this).data('name'),
                      parent = $(this).parent().offset()
                      offset = $(this).offset(),
                      //xPos = offset.left,
                      //yPos = offset.top;
                      xPos =  offset.left - parent.left,
                      yPos =  offset.top - parent.top;
                      

                      $(this).text('x: ' + xPos + 'y: ' + yPos);

                var stats = new Firebase(url+profile.id + '/stats/'+data_key)
                  stats.set([xPos,yPos]);
              }


   });
   
   $( ".dragger" ).each(function() {
         var data_key = $(this).data('name');
         $(this).data('done','yes');
         var dataRef = new Firebase(url+profile.id + '/stats/'+data_key);
         dataRef.once('value', function(snapshot) {
             var left_axis = snapshot.val()[0];
             var top_axis = snapshot.val()[1];
             console.log(left_axis,top_axis);
             $("div").find("[data-name='" + data_key + "']").css({top: top_axis,left: left_axis});
             
         });
     
   });
      
      
    });
}

function drawTimeline(positions) {
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
