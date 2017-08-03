function clearToken(){
  delete localStorage.tokenGlobal;
}

function loadPowerBIDashboard(dashboardName) {
	setTimeout(function () {
        location.reload()
    }, 100);

  var dashboardId = '', embedUrl = '', embedToken = '', groupsJson = {}, groupId = '';
  //Get groupId by calling Power BI REST Endpoint /groups 
  groupsJson = getGroups();
  console.log("groupsJson = "+groupsJson);
  var responseArr = groupsJson.value;
  for (var i in responseArr) {
    if (responseArr[i].name === "ryderdemo") {
      groupId = responseArr[i].id;

    }
  }
  console.log("groupId");
  console.log(groupId);
  if (groupId) {
    var dashboardsJson = {};
    //Get dashboards using the groupId
    dashboardJson = getDashboards(groupId);
    //Get dashboardId and embedUrl for the given dashboardName
    var dashboardArr = dashboardJson.value;
    for (var i in dashboardArr) {
      if (dashboardArr[i].displayName === dashboardName) {
        dashboardId = dashboardArr[i].id;
        embedUrl = dashboardArr[i].embedUrl;
      }
    }
    console.log("dashboardId = "+dashboardId+"embedUrl = "+embedUrl);
    //If (dashboardId && embedUrl), generate embedtoken for the dashboard
    if (dashboardId && embedUrl) {
      embedToken = generateTokenForDashboard(groupId, dashboardId);
    }
    //Embed dashboard using embedToken, embedUrl for the dashboard
    // Get models. models contains enums that can be used.
    var models = window['powerbi-client'].models;
    var permissions = models.Permissions.All;
    var config = {
      type: 'dashboard',
      accessToken: embedToken,
      embedUrl: embedUrl,
      tokenType: models.TokenType.Embed,
    };
    console.log("config = "+config);
    // Grab the reference to the div HTML element that will host the dashboard.
    var dashboardContainer = $('#embedContainer')[0];
    // Embed the dashboard and display it within the div container.
    var dashboard = powerbi.embed(embedContainer, config);
  }
}

function generateTokenForDashboard(groupId, dashboardId) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/dashboards/' + dashboardId + '/GenerateToken', false);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
  var bodyParams = {
    "accessLevel": "View"
  };
  xhr.send(JSON.stringify(bodyParams));
    if (xhr.readyState === 4 && xhr.status === 200) {
      var responseJson = JSON.parse(xhr.responseText);
      if (responseJson.token) {
        return responseJson.token;
      }
    } else {
      return "";
    }
}

function getDashboards(groupId) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/dashboards', false);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.send(null);
    if (xhr.readyState==4 && xhr.status === 200) {
      var responseJson = JSON.parse(xhr.responseText);
      return responseJson;
    } else {
      //Not a Success
       return "{}";
    }
  
}

function getGroups() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.powerbi.com/v1.0/myorg/groups', false);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.send(null);
  if (xhr.readyState==4 && xhr.status === 200) {
    var responseJson = JSON.parse(xhr.responseText);
    return responseJson;  
  } else {
    return "{}";
  }

  /*xhr.onreadystatechange = function() {
    if (xhr.readyState==4 && xhr.status === 200) {
      var responseJson = JSON.parse(xhr.responseText);
      return true;
    } else {
      //Not a Success
      return "{}";
    }
  };*/

}




function loadPowerBIReport(reportName){
	setTimeout(function () {
        location.reload()
    }, 100);
    
  console.log(reportName);
  console.log("Azure Active Directory Token::");
  console.log(localStorage.tokenGlobal);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.powerbi.com/v1.0/myorg/groups', true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Groups - XHR Response");
      console.log(JSON.parse(xhr.responseText));
      var responseJson = JSON.parse(xhr.responseText);
      var responseArr = responseJson.value;
      console.log("Groups - responseArr");
      console.log(responseArr);
      var groupId = '';
      for (var i in responseArr) {
        if (responseArr[i].name === "ryderdemo") {
          groupId = responseArr[i].id;
        }
      }
      console.log("Group ID::");
      console.log(groupId);
      if (groupId) {
        fetchReportByGroupId(groupId, reportName);
      }

    } else {
      // TODO: Do something with the error (or non-200 responses)
      document.getElementById('api_response').textContent =
        'ERROR:\n\n' + xhr.responseText;
    }
  };
  xhr.send();
}

function fetchReportByGroupId(groupId, reportName){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports', true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Reports - XHR Response");
      console.log(JSON.parse(xhr.responseText));
      var responseJson = JSON.parse(xhr.responseText);
      var responseArr = responseJson.value;
      console.log("Reports - responseArr");
      console.log(responseArr);
      var reportId = '',
        embedUrl = '';
      for (var i in responseArr) {
        if (responseArr[i].name === reportName) {
          reportId = responseArr[i].id;
          embedUrl = responseArr[i].embedUrl;
        }
      }
      console.log("Report ID::");
      console.log(reportId);
      console.log("Embed URL::");
      console.log(embedUrl);
      if (reportId && embedUrl) {
        generateToken(reportId, embedUrl, groupId);
      }

    } else {
      // TODO: Do something with the error (or non-200 responses)
      document.getElementById('api_response').textContent =
        'ERROR:\n\n' + xhr.responseText;
    }
  };
  xhr.send();
}

function generateToken(reportId, embedUrl, groupId){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.powerbi.com/v1.0/myorg/groups/'+groupId+'/reports/'+reportId+'/GenerateToken', true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.tokenGlobal);
  xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
  var bodyParams = {
  "accessLevel": "View"
  };
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Generate Token - XHR Response");
        console.log(JSON.parse(xhr.responseText));
        var responseJson = JSON.parse(xhr.responseText);
        console.log("Generate Token - JSON Response");
        console.log(responseJson);
        console.log("Generate Token - token");
        console.log(responseJson.token);
        if(responseJson.token){
         embedPowerBIReport(responseJson.token, reportId, embedUrl);
        }
    } else {
      // TODO: Do something with the error (or non-200 responses)
      document.getElementById('api_response').textContent =
        'ERROR:\n\n' + xhr.responseText;
    }
  };
  xhr.send(JSON.stringify(bodyParams));

}

function embedPowerBIReport(embedToken, reportId, embedUrl){
// Get models. models contains enums that can be used.
  var models = window['powerbi-client'].models;

  // We give All permissions to demonstrate switching between View and Edit mode and saving report.
  var permissions = models.Permissions.All;

  // Embed configuration used to describe the what and how to embed.
  // This object is used when calling powerbi.embed.
  // This also includes settings and options such as filters.
  // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
  var config = {
    type: 'report',
    accessToken: embedToken,
    embedUrl: embedUrl,
    tokenType: models.TokenType.Embed,
    id: reportId,
     // permissions: permissions,
      settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
      }
  };
// Get a reference to the embedded report HTML element
var embedContainer = $('#embedContainer')[0];
// Embed the report and display it within the div container.
var report = powerbi.embed(embedContainer, config);
 
 console.log("config");
 console.log(config);
}
 
 /*
 // Report.off removes a given event handler if it exists.
    //report.off("loaded");
 
   // Report.on will add an event handler which prints to Log window.
report.on("loaded", function() {
    Log.logText("Loaded");
});
 
report.on("error", function(event) {
    Log.log(event.detail);
     
    report.off("error");
});
 
report.off("saved");
report.on("saved", function(event) {
    Log.log(event.detail);
    if(event.detail.saveAs) {
        Log.logText('In order to interact with the new report, create a new token and load the new report');
     }
}
 */
