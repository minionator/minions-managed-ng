"use strict";function pad(e,t,n){return n=n||"0",(e+="").length>=t?e:new Array(t-e.length+1).join(n)+e}angular.module("minionsManagedNgApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","chart.js"]).config(["$routeProvider",function(e){e.when("/minions/:workerType?/:dataCenter?",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/chart",{templateUrl:"views/chart.html",controller:"ChartCtrl",controllerAs:"chart"}).otherwise({redirectTo:"/minions"})}]).value("personas",["amazed","bananas","big","cake","crazy","curious","dancing","duck","girl","golf","happy","hello","kungfu","reading","sad","shout","shy","superman"]),angular.module("minionsManagedNgApp").controller("MainCtrl",["$scope","$location","$routeParams","mmApi",function(a,e,t,n){function d(e,t){return 1===e?t:t+"s"}a.path=e.path(),a.routeParams=t,a.workerTypes=["gecko-1-b-win2012","gecko-2-b-win2012","gecko-3-b-win2012","gecko-t-win7-32","gecko-t-win7-32-gpu","gecko-t-win10-64","gecko-t-win10-64-gpu","gecko-t-win10-64-hw"],a.dataCenters=t.workerType&&t.workerType.endsWith("-hw")?["mdc1","mdc2"]:["use1","use2","usw1","usw2","euc1"],a.selected={workerType:t.workerType||a.workerTypes[0],dataCenter:t.dataCenter||a.dataCenters[0]},a.getData=function(e,t){a.loading={counts:!0,minions:{alive:!0,idle:!0,dead:!0}},a.dataCenters=[],a.minions={},n.counts({state:"alive"},function(e){a.counts={},e.forEach(function(e){a.workerTypes.indexOf(e._id.workerType)<0&&(a.workerTypes.push(e._id.workerType),a.workerTypes.sort()),a.dataCenters.indexOf(e._id.dataCenter)<0&&(a.dataCenters.push(e._id.dataCenter),a.dataCenters.sort()),null==a.counts[e._id.workerType]&&(a.counts[e._id.workerType]={count:0}),a.counts[e._id.workerType][e._id.dataCenter]=e.count,a.counts[e._id.workerType].count+=e.count}),a.loading.counts=!1}),a.selected.workerType=e,n.history({workerType:a.selected.workerType,period:"hour"},function(e){var t=Array.from(new Set(e.map(function(e){return pad(e._id.month,2)+"/"+pad(e._id.day,2)+" "+pad(e._id.hour,2)})));t.sort();var n=Array.from(new Set(e.map(function(e){return e._id.dataCenter})));n.sort(),a.chart={labels:t,series:n,data:n.map(function(n){return t.map(function(t){return(e.find(function(e){return n===e._id.dataCenter&&t===pad(e._id.month,2)+"/"+pad(e._id.day,2)+" "+pad(e._id.hour,2)})||{count:0}).count})})}}),a.selected.dataCenter=t,n.query({state:"alive",workerType:a.selected.workerType,dataCenter:a.selected.dataCenter,limit:1e3},function(e){a.minions.alive=e,a.loading.minions.alive=!1}),n.query({state:"dead",workerType:a.selected.workerType,dataCenter:a.selected.dataCenter,limit:100},function(e){a.minions.idle=e.filter(function(e){return!e.tasks||0===e.tasks.length}),a.loading.minions.idle=!1,a.minions.dead=e.filter(function(e){return e.tasks&&e.tasks.length}),a.loading.minions.dead=!1})},a.getUptime=function(e,t,n,a){if(null==e)return"unknown";var s=((t?new Date(t):new Date)-new Date(e))/1e3,i=Math.floor(s/86400),r=Math.floor((s-86400*i)/3600),o=Math.floor((s-86400*i-3600*r)/60),l=Math.floor(s-86400*i-3600*r-60*o);return n?a?r+":"+o+":"+l:i+" "+r+":"+o+":"+l:0<i?i+" "+d(i,"day"):0<r?r+" "+d(r,"hour"):0<o?o+" "+d(o,"minute"):l+d(l,"second")},a.getTtl=function(e){if(null==e.spotRequest||null==e.spotRequest.created||null==e.tasks||e.tasks.length<1)return"unknown";var t=new Date(e.spotRequest.created),n=(new Date(e.tasks[0].started)-t)/1e3,a=Math.floor(n/86400),s=Math.floor((n-86400*a)/3600),i=Math.floor((n-86400*a-3600*s)/60);return s+":"+i+":"+Math.floor(n-86400*a-3600*s-60*i)},a.getRegion=function(e){switch(e){case"use1":return"us-east-1";case"use2":return"us-east-2";case"usw1":return"us-west-1";case"usw2":return"us-west-2";case"euc1":return"eu-central-1";default:return e}},a.getLogUrl=function(e){return e.dataCenter.startsWith("mdc")?"https://papertrailapp.com/systems/t-w1064-ms-"+e._id.slice(-3)+"."+e.dataCenter+".mozilla.com/events":"https://papertrailapp.com/systems/"+e._id.replace("0000000","i-")+"."+e.workerType+"."+e.dataCenter+".mozilla.com/events"},a.getHostname=function(e){return e.dataCenter.startsWith("mdc")?"t-w1064-ms-"+e._id.slice(-3):e._id.replace("0000000","i-")},a.showBody={alive:!1,idle:!1,dead:!1},a.toggle=function(t){a.showBody[t]=!a.showBody[t],a.minions[t].forEach(function(e){e.showbody=a.showBody[t]})},a.getData(a.selected.workerType,a.selected.dataCenter)}]),angular.module("minionsManagedNgApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("minionsManagedNgApp").factory("mmApi",["$resource",function(e){var t="https://api.minions-managed.tk/";return e(t,{state:"@_state",period:"@_period",workerType:"@_workerType",dataCenter:"@_dataCenter",limit:"@_limit"},{query:{url:t+"minions/:state/:workerType/:dataCenter/:limit",isArray:!0},counts:{url:t+"minion/:state/count",method:"GET",isArray:!0},allHistory:{url:t+"minion/:period/stats",method:"GET",isArray:!0},history:{url:t+"minion/:workerType/:period/stats",method:"GET",isArray:!0}})}]),angular.module("minionsManagedNgApp").controller("ChartCtrl",["$scope","mmApi",function(a,e){e.allHistory({period:"day"},function(e){var t=Array.from(new Set(e.map(function(e){return e._id.year+"-"+pad(e._id.month,2)+"-"+pad(e._id.day,2)})));t.sort();var n=Array.from(new Set(e.map(function(e){return e._id.workerType})));n.sort(),a.chart={labels:t,series:n,data:n.map(function(n){return t.map(function(t){return(e.find(function(e){return n===e._id.workerType&&t===e._id.year+"-"+pad(e._id.month,2)+"-"+pad(e._id.day,2)})||{count:0}).count})})}})}]),angular.module("minionsManagedNgApp").controller("BaseCtrl",["personas",function(e){this.persona=e[Math.floor(Math.random()*e.length)]}]),angular.module("minionsManagedNgApp").directive("detectActiveTab",["$location",function(r){return{link:function(e,s,i){e.$on("$routeChangeSuccess",function(e,t,n){var a=i.detectActiveTab||1;(r.path().split("/")[a]||"current $location.path doesn't reach this level")===(i.href.split("/")[a]||"href doesn't include this level")?s.parent().addClass("active"):s.parent().removeClass("active")})}}}]),angular.module("minionsManagedNgApp").run(["$templateCache",function(e){e.put("views/about.html","<p>This is the about view.</p> "),e.put("views/chart.html",'<h2>Instance creations by date</h2> <canvas class="chart chart-line" chart-data="chart.data" chart-labels="chart.labels" chart-series="chart.series"></canvas>'),e.put("views/main.html",'<ul class="nav nav-tabs"> <li ng-repeat="workerType in workerTypes" ng-class="{active: workerType === selected.workerType}" ng-show="counts[workerType].count"> <a class="pointer" ng-href="#!/minions/{{workerType}}/{{selected.dataCenter}}">{{workerType}} ({{counts[workerType].count}})</a> </li> </ul> <div style="padding: 10px"> <div style="height: 200px"> <canvas class="chart chart-line" chart-data="chart.data" chart-labels="chart.labels" chart-series="chart.series" chart-options="{maintainAspectRatio: false}"></canvas> </div> <ul class="nav nav-tabs" ng-hide="loading.counts"> <li ng-repeat="dataCenter in dataCenters" ng-class="{active: dataCenter === selected.dataCenter}" enabled> <a class="pointer" ng-href="#!/minions/{{selected.workerType}}/{{dataCenter}}" enabled>{{getRegion(dataCenter)}} ({{counts[selected.workerType][dataCenter] || 0}})</a> </li> </ul> </div> <div class="clearfix" ng-repeat="state in [\'alive\', \'idle\', \'dead\']"> <div class="row"> <div class="clearfix col-sm-10"> <h3> <span ng-show="state === \'alive\'">living</span><span ng-show="state !== \'alive\'">{{state}}</span> minions ({{minions[state].length}}) </h3> <p ng-show="state === \'idle\'">minions that did no work before expiring.</p> <p ng-show="[\'idle\', \'dead\'].includes(state) && minions[state].length === 100">results limited to the last 100.</p> </div> <div class="clearfix col-sm-2"> <button class="btn btn-small pull-right" ng-click="toggle(state)"> <span class="glyphicon" ng-class="{\'glyphicon-plus\': !showBody[state], \'glyphicon-minus\': showBody[state]}"></span> </button> </div> </div> <div ng-show="loading.counts || loading.minions.alive" class="spinner"> <div class="cube1"></div> <div class="cube2"></div> </div> <div class="clearfix col-sm-2" ng-repeat="minion in minions[state] | orderBy: \'created\'" ng-hide="loading.minions[state]"> <div class="panel" ng-class="{\n      \'panel-default\': ((state === \'dead\') || ((state === \'alive\') && (minion.tasks.length === 0 && (minion.restarts.length - minion.tasks.length) < 2))),\n      \'panel-info\': ((state === \'alive\') && (minion.tasks.length > 0 && (minion.restarts.length - minion.tasks.length) < 2)),\n      \'panel-warning\': ((state === \'idle\') || (state === \'alive\') && ((minion.restarts.length - minion.tasks.length) === 2)),\n      \'panel-danger\': ((state === \'alive\') && ((minion.restarts.length - minion.tasks.length) > 2))\n    }"> <div class="panel-heading"> <h4 class="panel-title"> <a class="pointer" ng-click="minion.showbody=!minion.showbody">{{getHostname(minion)}}</a> </h4> tasks: {{minion.tasks.length}}, restarts: {{minion.restarts.length}}, uptime: <span>{{getUptime(minion.created, minion.terminated.time)}}</span> </div> <div class="panel-body" ng-show="minion.showbody"> <div> <span ng-show="minion.created">{{minion.created | date: \'dd MMM HH:mm\'}}</span> ~ <span ng-show="minion.terminated.time">{{minion.terminated.time | date: \'dd MMM HH:mm\'}}</span> ({{getUptime(minion.created, minion.terminated.time, true)}}) </div> <div> {{minion.ipAddress}} {{minion.instanceType}} </div> <div> {{minion.spotRequest.id}} {{minion.spotRequest.created | date: \'dd MMM HH:mm\'}} ~ {{minion.spotRequest.fulfilled | date: \'HH:mm\'}} </div> <div> <a href="{{getLogUrl(minion)}}" title="event logs"> <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> </a> <a href="https://console.aws.amazon.com/ec2/v2/home?region={{getRegion(minion.dataCenter)}}#Instances:instanceId={{minion._id.replace(\'0000000\', \'i-\')}}" title="ec2 console" ng-hide="(minion.dataCenter.startsWith(\'mdc\'))"> <span class="glyphicon glyphicon-dashboard" aria-hidden="true"></span> </a> </div> <ul class="list-group" ng-show="minion.tasks.length"> <li ng-repeat="task in minion.tasks" class="list-group-item list-group-item-default"> <a href="https://tools.taskcluster.net/task-inspector/#{{task.id}}" class="btn" ng-class="{\n'+"              'btn-success': (task.result === 'Success'),\n              'btn-danger': (task.result === 'Failure'),\n              'btn-default': (task.result === undefined)}\"> <span class=\"glyphicon\" ng-class=\"{\n                'glyphicon-thumbs-up': (task.result === 'Success'),\n                'glyphicon-thumbs-down': (task.result === 'Failure'),\n                'glyphicon-hourglass': (task.result === undefined)}\" aria-hidden=\"true\"></span> {{task.id}} </a><br> {{task.started | date: 'HH:mm:ss'}} <span ng-show=\"task.completed\"> ~ {{task.completed | date: 'HH:mm:ss'}} ({{getUptime(task.started, task.completed, false, true)}}) </span> </li> </ul> <ul class=\"list-group\" ng-show=\"minion.restarts.length\"> <li ng-repeat=\"restart in minion.restarts\" class=\"list-group-item list-group-item-default\"> restart {{restart.time | date: 'dd MMM HH:mm'}}<br> {{restart.user}}<br> {{restart.comment}} </li> </ul> </div> </div> </div> </div>")}]);