"use strict";function pad(a,b,c){return c=c||"0",a+="",a.length>=b?a:new Array(b-a.length+1).join(c)+a}angular.module("minionsManagedNgApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","chart.js"]).config(["$routeProvider",function(a){a.when("/home",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/chart",{templateUrl:"views/chart.html",controller:"ChartCtrl",controllerAs:"chart"}).otherwise({redirectTo:"/home"})}]).value("personas",["amazed","bananas","big","cake","crazy","curious","dancing","duck","girl","golf","happy","hello","kungfu","reading","sad","shout","shy","superman"]),angular.module("minionsManagedNgApp").controller("MainCtrl",["$scope","mmApi",function(a,b){function c(){b.counts({state:"alive"},function(b){a.workerTypes=[],a.dataCenters=[],a.counts={},b.forEach(function(b){a.workerTypes.indexOf(b._id.workerType)<0&&(a.workerTypes.push(b._id.workerType),a.workerTypes.sort()),a.dataCenters.indexOf(b._id.dataCenter)<0&&(a.dataCenters.push(b._id.dataCenter),a.dataCenters.sort()),null==a.counts[b._id.workerType]&&(a.counts[b._id.workerType]={count:0}),a.counts[b._id.workerType][b._id.dataCenter]=b.count,a.counts[b._id.workerType].count+=b.count}),a.loading.counts=!1})}function d(){b.history({workerType:a.selected.workerType,period:"hour"},function(b){var c=Array.from(new Set(b.map(function(a){return pad(a._id.month,2)+"/"+pad(a._id.day,2)+" "+pad(a._id.hour,2)})));c.sort();var d=Array.from(new Set(b.map(function(a){return a._id.dataCenter})));d.sort(),a.chart={labels:c,series:d,data:d.map(function(a){return c.map(function(c){return(b.find(function(b){return a===b._id.dataCenter&&c===pad(b._id.month,2)+"/"+pad(b._id.day,2)+" "+pad(b._id.hour,2)})||{count:0}).count})})}})}function e(a,b){return 1===a?b:b+"s"}a.workerTypes=["gecko-1-b-win2012","gecko-2-b-win2012","gecko-3-b-win2012","gecko-t-win7-32","gecko-t-win7-32-gpu","gecko-t-win10-64","gecko-t-win10-64-gpu"],a.dataCenters=["euc1","use1","use2","usw1","usw2"],a.selected={workerType:a.workerTypes[0],dataCenter:a.dataCenters[1]},a.getData=function(e,f){a.loading={counts:!0,minions:{alive:!0,idle:!0,dead:!0}},a.dataCenters=[],a.minions={},c(),a.selected.workerType=e,d(),a.selected.dataCenter=f,b.query({state:"alive",workerType:a.selected.workerType,dataCenter:a.selected.dataCenter},function(b){a.minions.alive=b,a.loading.minions.alive=!1}),b.query({state:"dead",workerType:a.selected.workerType,dataCenter:a.selected.dataCenter},function(b){a.minions.idle=b.filter(function(a){return!a.tasks||0===a.tasks.length}),a.loading.minions.idle=!1,a.minions.dead=b.filter(function(a){return a.tasks&&a.tasks.length}),a.loading.minions.dead=!1})},a.getUptime=function(a,b){if(null==a)return"unknown";var c=b?new Date(b):new Date,d=(c-new Date(a))/1e3,f=Math.floor(d/86400),g=Math.floor((d-86400*f)/3600),h=Math.floor((d-86400*f-3600*g)/60),i=Math.floor(d-86400*f-3600*g-60*h);return f>0?f+" "+e(f,"day"):g>0?g+" "+e(g,"hour"):h>0?h+" "+e(h,"minute"):i+e(i,"second")},a.getRegion=function(a){switch(a){case"use1":return"us-east-1";case"use2":return"us-east-2";case"usw1":return"us-west-1";case"usw2":return"us-west-2";case"euc1":return"eu-central-1";default:return a}},a.getData(a.selected.workerType,a.selected.dataCenter)}]),angular.module("minionsManagedNgApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("minionsManagedNgApp").factory("mmApi",["$resource",function(a){var b="https://api.minions-managed.tk/";return a(b,{state:"@_state",period:"@_period",workerType:"@_workerType",dataCenter:"@_dataCenter"},{query:{url:b+"minions/:state/:workerType/:dataCenter",isArray:!0},counts:{url:b+"minion/:state/count",method:"GET",isArray:!0},allHistory:{url:b+"minion/:period/stats",method:"GET",isArray:!0},history:{url:b+"minion/:workerType/:period/stats",method:"GET",isArray:!0}})}]),angular.module("minionsManagedNgApp").controller("ChartCtrl",["$scope","mmApi",function(a,b){b.allHistory({period:"day"},function(b){var c=Array.from(new Set(b.map(function(a){return a._id.year+"-"+pad(a._id.month,2)+"-"+pad(a._id.day,2)})));c.sort();var d=Array.from(new Set(b.map(function(a){return a._id.workerType})));d.sort(),a.chart={labels:c,series:d,data:d.map(function(a){return c.map(function(c){return(b.find(function(b){return a===b._id.workerType&&c===b._id.year+"-"+pad(b._id.month,2)+"-"+pad(b._id.day,2)})||{count:0}).count})})}})}]),angular.module("minionsManagedNgApp").controller("BaseCtrl",["personas",function(a){this.persona=a[Math.floor(Math.random()*a.length)]}]),angular.module("minionsManagedNgApp").directive("detectActiveTab",["$location",function(a){return{link:function(b,c,d){b.$on("$routeChangeSuccess",function(b,e,f){var g=d.detectActiveTab||1;(a.path().split("/")[g]||"current $location.path doesn't reach this level")===(d.href.split("/")[g]||"href doesn't include this level")?c.parent().addClass("active"):c.parent().removeClass("active")})}}}]),angular.module("minionsManagedNgApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/chart.html",'<h2>Instance creations by date</h2> <canvas class="chart chart-line" chart-data="chart.data" chart-labels="chart.labels" chart-series="chart.series"></canvas>'),a.put("views/main.html",'<ul class="nav nav-tabs"> <li ng-repeat="workerType in workerTypes" ng-class="{active: workerType === selected.workerType}" ng-show="counts[workerType].count"> <a class="pointer" ng-click="getData(workerType, selected.dataCenter)">{{workerType}} ({{counts[workerType].count}})</a> </li> </ul> <div style="padding: 10px"> <div style="height: 200px"> <canvas class="chart chart-line" chart-data="chart.data" chart-labels="chart.labels" chart-series="chart.series" chart-options="{maintainAspectRatio: false}"></canvas> </div> <ul class="nav nav-tabs" ng-hide="loading.counts"> <li ng-repeat="dataCenter in dataCenters" ng-class="{active: dataCenter === selected.dataCenter}" ng-show="counts[selected.workerType][dataCenter]"> <a class="pointer" ng-click="getData(selected.workerType, dataCenter)">{{getRegion(dataCenter)}} ({{counts[selected.workerType][dataCenter]}})</a> </li> </ul> </div> <div class="clearfix"> <h3>living minions ({{counts[selected.workerType][selected.dataCenter]}})</h3> <div ng-show="loading.counts || loading.minions.alive" class="spinner"> <div class="cube1"></div> <div class="cube2"></div> </div> <div class="clearfix col-sm-2" ng-repeat="minion in minions.alive | orderBy : \'created\'" ng-hide="loading.minions.alive"> <div class="panel" ng-class="{\n      \'panel-default\': (minion.tasks.length === 0 && (minion.restarts.length - minion.tasks.length) < 2),\n      \'panel-info\': (minion.tasks.length > 0 && (minion.restarts.length - minion.tasks.length) < 2),\n      \'panel-warning\': ((minion.restarts.length - minion.tasks.length) === 2),\n      \'panel-danger\': ((minion.restarts.length - minion.tasks.length) > 2)\n    }"> <div class="panel-heading"> <h4 class="panel-title"> <a class="pointer" ng-click="minion.showbody=!minion.showbody">{{minion._id.replace(\'0000000\', \'i-\')}}</a> </h4> tasks: {{minion.tasks.length}}, restarts: {{minion.restarts.length}}, uptime: <span>{{getUptime(minion.created)}}</span> </div> <div class="panel-body" ng-show="minion.showbody"> <ul> <li>ip: {{minion.ipAddress}}</li> <li>created: {{minion.created}}</li> <li ng-show="minion.instanceType">instance type: {{minion.instanceType}}</li> <li> <a href="https://papertrailapp.com/groups/2488493/events?q={{minion._id.replace(\'0000000\', \'i-\')}}">event logs</a> </li> <li> <a href="https://console.aws.amazon.com/ec2/v2/home?region={{getRegion(minion.dataCenter)}}#Instances:instanceId={{minion._id.replace(\'0000000\', \'i-\')}}">ec2 console</a> </li> <li> <a class="pointer" ng-click="minion.showtasks=!minion.showtasks">tasks ({{minion.tasks.length}})</a> <ul ng-show="minion.tasks.length && minion.showtasks"> <li ng-repeat="task in minion.tasks"> <a href="https://tools.taskcluster.net/task-inspector/#{{task.id}}">{{task.id}}</a> </li> </ul> </li> <li> <a style="cursor: pointer" ng-click="minion.showrestarts=!minion.showrestarts">restarts ({{minion.restarts.length}})</a> <ul ng-show="minion.restarts.length && minion.showrestarts"> <li ng-repeat="restart in minion.restarts"> {{restart.time}}<br> {{restart.user}}<br> {{restart.comment}} </li> </ul> </li> </ul> </div> </div> </div> </div> <hr class="clearfix" ng-show="minions.idle.length"> <div class="clearfix" ng-show="minions.idle.length"> <h3>idle minions ({{minions.idle.length}})</h3> <p>minions that did nothing and died. results limited to the last day.</p> <div ng-show="loading.counts || loading.minions.idle" class="spinner"> <div class="cube1"></div> <div class="cube2"></div> </div> <div class="clearfix col-sm-2" ng-repeat="minion in minions.idle | orderBy : \'created\'" ng-hide="loading.minions.idle"> <div class="panel panel-warning"> <div class="panel-heading"> <h4 class="panel-title"> <a class="pointer" ng-click="minion.showbody=!minion.showbody">{{minion._id.replace(\'0000000\', \'i-\')}}</a> </h4> tasks: {{minion.tasks.length}}, restarts: {{minion.restarts.length}}, uptime: <span>{{getUptime(minion.created, minion.terminated.time)}}</span> </div> <div class="panel-body" ng-show="minion.showbody"> <ul> <li>ip: {{minion.ipAddress}}</li> <li>created: {{minion.created}}</li> <li> terminated: {{minion.terminated.time}}<br> {{minion.terminated.user}}<br> {{minion.terminated.comment}} </li> <li ng-show="minion.instanceType">instance type: {{minion.instanceType}}</li> <li> <a href="https://papertrailapp.com/groups/2488493/events?q={{minion._id.replace(\'0000000\', \'i-\')}}">event logs</a> </li> <li> <a href="https://console.aws.amazon.com/ec2/v2/home?region={{getRegion(minion.dataCenter)}}#Instances:instanceId={{minion._id.replace(\'0000000\', \'i-\')}}">ec2 console</a> </li> <li> <a class="pointer" ng-click="minion.showtasks=!minion.showtasks">tasks ({{minion.tasks.length}})</a> <ul ng-show="minion.tasks.length && minion.showtasks"> <li ng-repeat="task in minion.tasks"> <a href="https://tools.taskcluster.net/task-inspector/#{{task.id}}">{{task.id}}</a> </li> </ul> </li> <li> <a style="cursor: pointer" ng-click="minion.showrestarts=!minion.showrestarts">restarts ({{minion.restarts.length}})</a> <ul ng-show="minion.restarts.length && minion.showrestarts"> <li ng-repeat="restart in minion.restarts"> {{restart.time}}<br> {{restart.user}}<br> {{restart.comment}} </li> </ul> </li> </ul> </div> </div> </div> </div> <hr class="clearfix"> <div class="clearfix"> <h3>dead minions ({{minions.dead.length}})</h3> <p>minions that did some work and died. results limited to the last day.</p> <div ng-show="loading.counts || loading.minions.dead" class="spinner"> <div class="cube1"></div> <div class="cube2"></div> </div> <div class="clearfix col-sm-2" ng-repeat="minion in minions.dead | orderBy : \'created\'" ng-hide="loading.minions.dead"> <div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title"> <a class="pointer" ng-click="minion.showbody=!minion.showbody">{{minion._id.replace(\'0000000\', \'i-\')}}</a> </h4> tasks: {{minion.tasks.length}}, restarts: {{minion.restarts.length}}, uptime: <span>{{getUptime(minion.created, minion.terminated.time)}}</span> </div> <div class="panel-body" ng-show="minion.showbody"> <ul> <li>ip: {{minion.ipAddress}}</li> <li>created: {{minion.created}}</li> <li> terminated: {{minion.terminated.time}}<br> {{minion.terminated.user}}<br> {{minion.terminated.comment}} </li> <li ng-show="minion.instanceType">instance type: {{minion.instanceType}}</li> <li> <a href="https://papertrailapp.com/groups/2488493/events?q={{minion._id.replace(\'0000000\', \'i-\')}}">event logs</a> </li> <li> <a href="https://console.aws.amazon.com/ec2/v2/home?region={{getRegion(minion.dataCenter)}}#Instances:instanceId={{minion._id.replace(\'0000000\', \'i-\')}}">ec2 console</a> </li> <li> <a class="pointer" ng-click="minion.showtasks=!minion.showtasks">tasks ({{minion.tasks.length}})</a> <ul ng-show="minion.tasks.length && minion.showtasks"> <li ng-repeat="task in minion.tasks"> <a href="https://tools.taskcluster.net/task-inspector/#{{task.id}}">{{task.id}}</a> </li> </ul> </li> <li> <a style="cursor: pointer" ng-click="minion.showrestarts=!minion.showrestarts">restarts ({{minion.restarts.length}})</a> <ul ng-show="minion.restarts.length && minion.showrestarts"> <li ng-repeat="restart in minion.restarts"> {{restart.time}}<br> {{restart.user}}<br> {{restart.comment}} </li> </ul> </li> </ul> </div> </div> </div> </div>')}]);