"use strict";
// Online version OCt/17 
var max_valor_msg=300;
var max_valor_username=15;
//Client's username. Will be updated when they connect to the server.
var username="0";
var ignores=[]; // current client's ignore list
//Array of chat rooms
var public_chatrooms=[]; //list of names
//var client_chatrooms=[]; //DEPRECATED list of objects CONTAINS all the chatroom names and users related that the USER has joined
 
//Connect to the server via socket.io    --WARNING-- REMOVE 'http://localhost' if it goes to the online version
//var socket = io('http://localhost');
var socket = io();
var btnadd_me = document.getElementById('add_me');   
var tabs = [];
var tab_total_count = 0;
/*****************************************************/
// Anchorme.js 0.6.0 (min function) License: The MIT License (MIT) - Copyright (c) 2016 Alex Corvi
!function(e){"use strict";String.prototype.endsWith||(String.prototype.endsWith=function(e,t){var i=this.toString();("number"!=typeof t||!isFinite(t)||Math.floor(t)!==t||t>i.length)&&(t=i.length),t-=e.length;var n=i.indexOf(e,t);return-1!==n&&n===t}),String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.substr(t,e.length)===e});var t={};t.occurrences=function(e,t,i){if(e+="",t+="",t.length<=0)return e.length+1;for(var n=0,r=0,a=i?1:t.length;;){if(r=e.indexOf(t,r),!(r>=0))break;n++,r+=a}return n},t.dontbreakHTML=function(e){for(var t=["src","href","cite","formaction","icon","manifest","poster","codebase","background","profile","usemap"],i=t.length;i--;){var n=[t[i]+'=" ',t[i]+"=' "],r=[t[i]+'="',t[i]+"='"];e=e.split(n[0]).join(r[0]),e=e.split(n[1]).join(r[1])}return e},t.removeCharifItEndsWithIt=function(e,i){return e.endsWith(i)?(e=e.substring(0,e.length-1),t.removeCharifItEndsWithIt(e,i)):e},t.TLDs=[".com",".org",".edu",".gov",".uk",".net",".ca",".de",".jp",".fr",".au",".us",".ru",".ch",".it",".nl",".se",".no",".es",".io",".aero",".mil",".biz",".cat",".coop",".info",".jobs",".mobi",".museum",".name",".pro",".travel",".ac",".ad",".ae",".af",".ag",".ai",".al",".am",".an",".ao",".ap",".aq",".ar",".as",".at",".aw",".az",".ax",".ba",".bb",".bd",".be",".bf",".bg",".bh",".bi",".bj",".bm",".bn",".bo",".br",".bs",".bt",".bv",".bw",".by",".bz",".cc",".cd",".cf",".cg",".ci",".ck",".cl",".cm",".cn",".co",".cr",".cs",".cu",".cv",".cx",".cy",".cz",".dj",".dk",".dm",".do",".dz",".ec",".ee",".eg",".eh",".er",".et",".eu",".fi",".fj",".fk",".fm",".fo",".ga",".gb",".gd",".ge",".gf",".gg",".gh",".gi",".gl",".gm",".gn",".gp",".gq",".gr",".gs",".gt",".gu",".gw",".gy",".hk",".hm",".hn",".hr",".ht",".hu",".id",".ie",".il",".im",".in",".io",".iq",".ir",".is",".je",".jm",".jo",".ke",".kg",".kh",".ki",".km",".kn",".kp",".kr",".kw",".ky",".kz",".la",".lb",".lc",".li",".lk",".lr",".ls",".lt",".lu",".lv",".ly",".ma",".mc",".md",".mg",".mh",".mk",".ml",".mm",".mn",".mo",".mp",".mq",".mr",".ms",".mt",".mu",".mv",".mw",".mx",".my",".mz",".na",".nc",".ne",".nf",".ng",".ni",".np",".nr",".nu",".nz",".om",".pa",".pe",".pf",".pg",".ph",".pk",".pl",".pm",".pn",".pr",".ps",".pt",".pw",".py",".qa",".re",".ro",".rw",".sa",".sb",".sc",".sd",".sg",".sh",".si",".sj",".sk",".sl",".sm",".sn",".so",".sr",".st",".sv",".sy",".sz",".tc",".td",".tf",".tg",".th",".tj",".tk",".tl",".tm",".tn",".to",".tp",".tr",".tt",".tv",".tw",".tz",".ua",".ug",".um",".uy",".uz",".va",".vc",".ve",".vg",".vi",".vn",".vu",".wf",".ws",".ye",".yt",".yu",".za",".zm",".zw",".guru",".berlin",".photography",".tips",".today",".email",".technology",".company",".clothing",".me",".asia",".abb",".academy",".active",".actor",".ads",".adult",".afl",".agency",".aig",".airforce",".alsace",".amsterdam",".android",".apartments",".app",".aquarelle",".archi",".army",".associates",".attorney",".auction",".audio",".auto",".autos",".axa",".azure",".band",".bank",".bar",".barcelona",".barclays",".bargains",".bauhaus",".bayern",".bbc",".bbva",".bcn",".beer",".bentley",".best",".bharti",".bible",".bid",".bike",".bing",".bingo",".bio",".black",".blackfriday",".bloomberg",".blue",".bmw",".bnl",".bnpparibas",".boats",".bond",".boo",".boutique",".bradesco",".bridgestone",".broker",".brother",".brussels",".budapest",".build",".builders",".business",".buzz",".bzh",".cab",".cafe",".cal",".camera",".camp",".canon",".capetown",".capital",".caravan",".cards",".care",".career",".careers",".cars",".cartier",".casa",".cash",".casino",".catering",".cba",".cbn",".center",".ceo",".cern",".cfa",".cfd",".channel",".chat",".cheap",".chloe",".christmas",".chrome",".church",".cisco",".citic",".city",".claims",".cleaning",".click",".clinic",".cloud",".club",".coach",".codes",".coffee",".college",".cologne",".community",".computer",".condos",".construction",".consulting",".contractors",".cooking",".cool",".corsica",".country",".coupons",".courses",".credit",".creditcard",".cricket",".crown",".crs",".cruises",".cuisinella",".cw",".cymru",".cyou",".dabur",".dad",".dance",".date",".dating",".datsun",".day",".dclk",".deals",".degree",".delivery",".delta",".democrat",".dental",".dentist",".desi",".design",".dev",".diamonds",".diet",".digital",".direct",".directory",".discount",".dnp",".docs",".dog",".doha",".domains",".doosan",".download",".drive",".durban",".dvag",".earth",".eat",".education",".emerck",".energy",".engineer",".engineering",".enterprises",".epson",".equipment",".erni",".esq",".estate",".eus",".events",".everbank",".exchange",".expert",".exposed",".express",".fail",".faith",".fan",".fans",".farm",".fashion",".feedback",".film",".finance",".financial",".firmdale",".fish",".fishing",".fit",".fitness",".flights",".florist",".flowers",".flsmidth",".fly",".foo",".football",".forex",".forsale",".forum",".foundation",".frl",".frogans",".fund",".furniture",".futbol",".fyi",".gal",".gallery",".game",".garden",".gbiz",".gdn",".gent",".genting",".ggee",".gift",".gifts",".gives",".glass",".gle",".global",".globo",".gmail",".gmo",".gmx",".gold",".goldpoint",".golf",".goo",".goog",".google",".gop",".graphics",".gratis",".green",".gripe",".guge",".guide",".guitars",".hamburg",".hangout",".haus",".healthcare",".help",".here",".hermes",".hiphop",".hitachi",".hiv",".hockey",".holdings",".holiday",".homedepot",".homes",".honda",".horse",".host",".hosting",".hoteles",".hotmail",".house",".how",".hsbc",".ibm",".icbc",".icu",".ifm",".iinet",".immo",".immobilien",".industries",".infiniti",".ing",".ink",".institute",".insure",".int",".international",".investments",".irish",".ist",".istanbul",".iwc",".java",".jcb",".jetzt",".jewelry",".jlc",".jll",".joburg",".jprs",".juegos",".kaufen",".kddi",".kim",".kitchen",".kiwi",".koeln",".komatsu",".krd",".kred",".kyoto",".lacaixa",".land",".lasalle",".lat",".latrobe",".law",".lawyer",".lds",".lease",".leclerc",".legal",".lgbt",".liaison",".lidl",".life",".lighting",".limited",".limo",".link",".live",".loan",".loans",".lol",".london",".lotte",".lotto",".love",".ltda",".lupin",".luxe",".luxury",".madrid",".maif",".maison",".management",".mango",".market",".marketing",".markets",".marriott",".mba",".media",".meet",".melbourne",".meme",".memorial",".men",".menu",".miami",".microsoft",".mini",".mma",".moda",".moe",".monash",".money",".montblanc",".mormon",".mortgage",".moscow",".motorcycles",".mov",".movie",".movistar",".mtn",".mtpc",".nadex",".nagoya",".navy",".nec",".netbank",".network",".neustar",".new",".news",".nexus",".ngo",".nhk",".nico",".ninja",".nissan",".nra",".nrw",".ntt",".nyc",".office",".okinawa",".omega",".one",".ong",".onl",".online",".ooo",".oracle",".orange",".organic",".osaka",".otsuka",".ovh",".page",".panerai",".paris",".partners",".parts",".party",".pharmacy",".philips",".photo",".photos",".physio",".piaget",".pics",".pictet",".pictures",".pink",".pizza",".place",".play",".plumbing",".plus",".pohl",".poker",".porn",".post",".praxi",".press",".prod",".productions",".prof",".properties",".property",".pub",".qpon",".quebec",".racing",".realtor",".realty",".recipes",".red",".redstone",".rehab",".reise",".reisen",".reit",".ren",".rent",".rentals",".repair",".report",".republican",".rest",".restaurant",".review",".reviews",".rich",".ricoh",".rio",".rip",".rocks",".rodeo",".rs",".rsvp",".ruhr",".run",".ryukyu",".saarland",".sakura",".sale",".samsung",".sandvik",".sap",".sarl",".saxo",".sca",".scb",".school",".schule",".schwarz",".science",".seat",".sener",".services",".sew",".sex",".sexy",".shiksha",".shoes",".show",".shriram",".singles",".site",".ski",".sky",".skype",".sncf",".soccer",".social",".software",".sohu",".solar",".solutions",".sony",".soy",".space",".spiegel",".spreadbetting",".starhub",".statoil",".studio",".study",".style",".su",".sucks",".supplies",".supply",".support",".surf",".surgery",".suzuki",".swatch",".swiss",".sx",".sydney",".systems",".taipei",".tatar",".tattoo",".tax",".taxi",".team",".tech",".tel",".telefonica",".temasek",".tennis",".thd",".theater",".tickets",".tienda",".tires",".tirol",".tokyo",".tools",".top",".toray",".toshiba",".tours",".town",".toys",".trade",".trading",".training",".trust",".tui",".ubs",".university",".uno",".uol",".vacations",".vegas",".ventures",".versicherung",".vet",".viajes",".video",".villas",".vision",".vista",".vistaprint",".vlaanderen",".vodka",".vote",".voting",".voto",".voyage",".wales",".walter",".wang",".watch",".webcam",".website",".wed",".wedding",".weir",".wien",".wiki",".win",".windows",".wme",".work",".works",".world",".wtc",".wtf",".xbox",".xerox",".xin",".xxx",".xyz",".yandex",".youtube",".zip",".zone",".zuerich"],t.checks={},t.checks.ip=function(e){if(t.occurrences(e,".")>2){var i=e.split("."),n=i[0],r=i[1],a=i[2];if(i[3].indexOf(":")>0)var s=i[3].indexOf(":"),o=i[3].substring(0,s),l=i[3].substring(s);else if(i[3].indexOf("/")>0)var c=i[3].indexOf("/"),o=i[3].substring(0,c),l=i[3].substring(c);else var o=i[3],l=!1;return(l===!1||"/"===l.charAt(0)||":"===l.charAt(0))&&!isNaN(n)&&!isNaN(r)&&!isNaN(a)&&!isNaN(o)&&254>=n-1&&254>=r-1&&254>=a-1&&254>=o-1&&n.length>0&&r.length>0&&a.length>0&&o.length>0?!0:!1}return!1},t.checks.email=function(e,i){if(e=e.toLowerCase(),1==t.occurrences(e,"@")){e=t.removeCharifItEndsWithIt(e,"."),e=t.removeCharifItEndsWithIt(e,","),e=t.removeCharifItEndsWithIt(e,";");for(var n=e.indexOf("@"),r=e.substring(0,n),a=e.substring(n+1,e.length),s=!0,o=0;o<r.length;o++){var l=r[o];-1==="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.".indexOf(l)&&(o=r.length,s=!1)}for(var o=0;o<a.length;o++){var c=a[o];-1==="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.:".indexOf(c)&&(o=a.length,s=!1)}if(s){for(var d=!1,o=0;i>o;o++){var u=t.TLDs[o];e.endsWith(u)&&(o=t.TLDs.length,d=!0)}return d===!0?!0:!1}return!1}return!1},t.checks.url=function(e,i){if(e=e.toLowerCase(),e.indexOf(".")>0&&(e.indexOf("/")>3||e.indexOf("/")<0)){if(e=t.removeCharifItEndsWithIt(e,"."),e=t.removeCharifItEndsWithIt(e,","),e=t.removeCharifItEndsWithIt(e,";"),1==t.occurrences(e,".")&&e.indexOf(".")===e.length-1)return!1;var n=!0;if(e.indexOf("/")>3){var r=e.indexOf("/"),a=e.substring(0,r);if(a.indexOf("..")>-1)return!1;for(var s=0;s<a.length;s++){var o=a[s];-1==="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.:".indexOf(o)&&(s=a.length,n=!1)}}else{if(e.indexOf("..")>-1)return!1;for(var s=0;s<e.length;s++){var o=e[s];-1==="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.:".indexOf(o)&&(s=e.length,n=!1)}}if(n){if(e.endsWith(".com"))return!0;for(var s=0;i>s;s++){var l=t.TLDs[s];if(e.endsWith(l)||e.indexOf(l+"/")>-1||e.indexOf(l+":")>-1)return s=t.TLDs.length,!0}return!1}return!1}return!1},t.order=function(e,i){var n=e.split(" "),r=function(e){for(var t=0;t<e.length;t++)!(e[t].indexOf(".")>-1&&""!==e[t])||"("===e[t-1]&&")"===e[t+1]||"("!==e[t+1]&&")"!==e[t+1]||(e[t]=e[t]+e[t+1],"string"==typeof e[t+2]&&(e[t]=e[t]+e[t+2]),"string"==typeof e[t+3]&&(e[t]=e[t]+e[t+3]),"string"==typeof e[t+4]&&(e[t]=e[t]+e[t+4]),e.splice(t+1,4),r(e))},a=function(e){for(var t=0;t<e.length;t++)!(e[t].indexOf(".")>-1&&""!==e[t])||"["===e[t-1]&&"]"===e[t+1]||"["!==e[t+1]&&"]"!==e[t+1]||(e[t]=e[t]+e[t+1],"string"==typeof e[t+2]&&(e[t]=e[t]+e[t+2]),"string"==typeof e[t+3]&&(e[t]=e[t]+e[t+3]),"string"==typeof e[t+4]&&(e[t]=e[t]+e[t+4]),e.splice(t+1,4),r(e))};r(n),a(n);for(var s=0;s<n.length;s++){for(var o=!1,l=s;l>0&&(">"!==n[l]||"/a"!==n[l-1]||"<"!==n[l-2]);l--)if("a"===n[l]&&"<"===n[l-1]){o=!0;break}if(!o){var c=n[s],d=!1,u=!1;if(c.indexOf(".")>-1){for(var f=!0,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%",g=0;g<c.length;g++){var m=c[g];-1===h.indexOf(m)&&(g=c.length,f=!1)}if(f&&(i.urls&&(c.startsWith("http://")||c.startsWith("HTTP://"))?d=!0:i.urls&&(c.startsWith("https://")||c.startsWith("HTTPS://"))?d=!0:i.urls&&(c.startsWith("ftp://")||c.startsWith("FTP://"))?d=!0:i.urls&&(c.startsWith("file:///")||c.startsWith("FILE:///"))?d=!0:i.emails&&(c.startsWith("mailto:")||c.startsWith("MAILTO:"))?d=!0:t.checks.ip(c)&&i.ips&&c.indexOf(".")>0?(d=!0,u=i.defaultProtocol):t.checks.email(c,i.TLDs)&&i.emails&&c.indexOf(".")>-1&&c.indexOf("@")>-1?(d=!0,u="mailto:"):t.checks.url(c,i.TLDs)&&i.urls&&(d=!0,u=i.defaultProtocol),d)){var p=u?u+c:c;p=t.removeCharifItEndsWithIt(p,"."),p=t.removeCharifItEndsWithIt(p,","),p=t.removeCharifItEndsWithIt(p,";");var b=i.truncate<=1?c:c.substring(0,i.truncate)+"...";if(i.attributes){n[s]="<a href='"+p+"'";for(var v in i.attributes)n[s]=n[s]+" "+v+"='"+i.attributes[v]+"' ";n[s]=n[s]+">"+b+"</a>"}else n[s]="<a href='"+p+"'>"+b+"</a>"}}}}return n.join(" ")},t.js=function(e,i){"object"!=typeof i?i={attributes:!1,html:!0,ips:!0,emails:!0,urls:!0,TLDs:20,truncate:0,defaultProtocol:"http://"}:("object"!=typeof i.attributes&&(i.attributes=!1),"boolean"!=typeof i.html&&(i.html=!0),"boolean"!=typeof i.ips&&(i.ips=!0),"boolean"!=typeof i.emails&&(i.emails=!0),"boolean"!=typeof i.urls&&(i.urls=!0),"number"!=typeof i.TLDs&&(i.TLDs=20),"string"!=typeof i.defaultProtocol&&(i.defaultProtocol="http://"),"number"!=typeof i.truncate&&(i.truncate=0)),i.html&&(e.indexOf("</a>")>-1||e.indexOf("<img ")>-1||e.indexOf("<blockquote ")>-1||e.indexOf("<del ")>-1||e.indexOf("<iframe ")>-1||e.indexOf("<script  ")>-1||e.indexOf("<audio ")>-1||e.indexOf("<button ")>-1||e.indexOf("<command ")>-1||e.indexOf("<embed ")>-1||e.indexOf("<html ")>-1||e.indexOf("<video ")>-1||e.indexOf("<applet ")>-1||e.indexOf("<area ")>-1||e.indexOf("<base ")>-1||e.indexOf("<body ")>-1||e.indexOf("<frame ")>-1||e.indexOf("<head ")>-1||e.indexOf("<usemap ")>-1||e.indexOf("<link ")>-1||e.indexOf("<input ")>-1||e.indexOf("<source ")>-1||e.indexOf("<q ")>-1)&&(e=t.dontbreakHTML(e)),e=e.split("\n").join(" \n "),e=e.split("(").join(" ( "),e=e.split(")").join(" ) "),e=e.split("[").join(" [ "),e=e.split("]").join(" ] "),e=e.split("<").join(" < "),e=e.split(">").join(" > ");var n=t.order(e,i);return n=n.split(" \n ").join("\n"),n=n.split(" ( ").join("("),n=n.split(" ) ").join(")"),n=n.split(" [ ").join("["),n=n.split(" ] ").join("]"),n=n.split(" < ").join("<"),n=n.split(" > ").join(">")},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=t),exports.anchorme=t):"function"==typeof define&&define.amd?define("anchorme",[],function(){return t}):e.anchorme=t}("object"==typeof window?window:this);



/*****************************************************/
socket.on('welcome', function (data) {
    username=data["name"]; //Get the default name from the server
	//Add the name to the username box
	document.getElementById("WuserID").innerHTML="Welcome "+username+"!";
    console.log("Welcome "+username);
    
    //COOKIES
    //checkCookie(data["time"]); 

    //name list for all public rooms available to join
    public_chatrooms=data["rooms"];
    refresh_rooms();
    
	//FIRST TIME Add user to the first public chat (index 0) 
    join_chatroom(public_chatrooms[0]);
}); //welcome
/*****************************************************/
socket.on('JoningnewChatRoom', function (data) {
	add_me_chatroom(data["room"],data["others"], data["kind"]);    
}); //JoningnewChatRoom
/*****************************************************/
function checkCookie(d) {
    var cookiename=getCookie("username");
    if (cookiename!="") {
        alert("Welcome again " + cookiename);
    } else {
        cookiename = username;
        setCookie("username", cookiename,d,2);
    }
}
/*****************************************************/
function setCookie(cname, cvalue,d, exdays) {
  //  d.setTime(d.getTime() + (exdays*24*60*60*1000));
//    var expires = "expires="+ d.toUTCString();
    //document.cookie = cname + "=" + username + "; " + expires;
    document.cookie = cname + "=" + username ;
}
/*****************************************************/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
/*****************************************************/
socket.on('messageFromServer', function (data) {
	console.log("Received: "+JSON.stringify(data) );
	//Get what type of message it is
	var typeReceived=data["type"]; //data.type or data["type"] will give the type property of the object called data
	//0 is a normal message
	if("0"==typeReceived){
    	//Add the message to the chat
    	write_in_chat(typeReceived,data);
	//1 is the response to the user trying to update their username   	 
	} else if("1"==typeReceived){
    	//variable to hold the attempt's result (true==success, false==failure)
    	var changed=data["result"];
    	//If it returned "no", report it to the user
    	if("no"==changed){
        	//Explanation of what went wrong
        	var reason=data["reason"];
        	alert("Error: "+reason);
    	} else if("yes"==changed){
        	//Update the username box
        	username=data["updatedName"];
        	document.getElementById("WuserID").innerHTML="Welcome "+data["updatedName"]+ "!";
        	document.getElementById("userid").value="";
            
            //WARNING HERE is this happening twice? must to be check
        	//refreshUsers(data); //The server will send out a message telling the client to do this
    	}
	//2 is the response for a new user
	} else if("2"==typeReceived){
        var room=data["room"];        
    	console.log("New user on chatroom "+room);
    	//Store the name in a variable
    	var newUser=data["name"];
    	//Note that the user has connected
        if(username != newUser){
            write_in_chat(typeReceived,data);
            //Refresh the list of users online
            refreshUsers(data);             
        }

	//3 is the response is a user leaves
	} else if("3"==typeReceived){
        //io.sockets.emit("messageFromServer", {type:"3", room:publicRooms[j].name,time:timestamp,day:t_day,leaving_user:username,others:publicRooms[j].users});
        index= finding_tab_byname(data["leaving_user"]);  // index for private msg tab  
        console.log("indeice: "+index);
        if(index>=0){ //means we found a private msg tab
            write_in_chat(typeReceived,data);  //user disconected -warning- is not the same like closing tab
            //refreshUsers(data);   // WARNING we might not want to refresh the users, just make the dc'd one gray or unabled         
        }
        //refreshing users if the leaving_user is on any public or private room
            refreshUsers(data);      
        //WARNING If the leaving_user is on a private room we might also send a msg to the log
                
	//4 is the reponse if a user changes their name
	} else if("4"==typeReceived){
    	//Get the old and new names
    	var oldName=data["oldName"];
    	var newName=data["newName"];
        //Searching for the username that was updated by chatrooms
        for(var i=0; i<public_chatrooms.length;i++){
            var index= finding_tab_byname(public_chatrooms[i]);
            if(index >= 0){
                data.room=public_chatrooms[i]; 
                data.kind="public";
                //reviso todos los usuarios del tab, cambio el nombre
                var index_user= tabs[index].tab_users.indexOf(oldName);
                if(index_user >= 0){
                    console.log("found on PUBLIC msg");
                    tabs[index].tab_users[index_user] =newName;
                    write_in_chat(typeReceived,data);
                    if (tabs[index].tab_status){   // if the room is the actual tab
                        refresh_users_actualtab(index);
                    }
                }
            }
        }
        //Searching for the username that was updated by private rooms
         var index = finding_tab_byname(oldName);
        /*console.log("tab for PM changing user name: "+ index);
        console.log("old name:"+oldName);
        console.log("tabname: "+tabs[index].tab_name); */
        if(index >= 0){ //found a private msg with the user
                data.kind="private";
                console.log("found on private msg");
                var index_user= tabs[index].tab_users.indexOf(oldName);
                if(index_user >= 0){
                    tabs[index].tab_users[index_user] =newName;
                    write_in_chat(typeReceived,data);
                    // refresco el user
                    if (tabs[index].tab_status){   // if the room is the actual tab
                        refresh_users_actualtab(index);
                    }
                    //and refresh the new name on the tab name as well
                    tabs[index].tab_name=tabs[index].tab_name.replace(oldName,newName);
                    var refreshed_tab= document.getElementById(tabs[index].id_name).innerHTML;
                    var replacing_nametab= refreshed_tab.replace(oldName,newName);
                    document.getElementById(tabs[index].id_name).innerHTML= replacing_nametab;
                    //Get the tab's ID number (e.g. Tab_2 will return 2)
                    var id=tabs[index].id_name.substr(4);
                    //And add the destroy functionality back to it
                    var closing_x = document.getElementById("Cls_"+id);
                    //Add the onclick listener with destroy_me_Click
                    closing_x.addEventListener('click', destroy_me_Click);                     
                }    
        }
 	//7 if user is leaving a chat-room
    }else if("7"==typeReceived){
        if(username!=data["name"]){
            write_in_chat(typeReceived,data);   
            refreshUsers(data);
        }
 	}else { //If none of the above, respond that it's an unrecognized command
    	socket.emit("ERROR: unrecognized command: "+typeReceived);
 	}
});
/*****************************************************/
socket.on('errorMessage', function (data) {
    if (username == data["sender"]){
        write_in_chat("8",data);
    }
});
/*****************************************************/
socket.on('newPrivateMessage', function (data) {
    if (username == data["sender"]){
        write_in_chat("6",data);
    }else{
        //alert(data["sender"]+", "+data["recipient"]+", "+data["message"]);
        write_in_chat("5",data);   
        console.log("New private message");
        console.log(data["sender"]+" sent this user ("+data["recipient"]+") the following message: "+data["message"]);
    }
});
/*****************************************************/
// Refreshes the users list on the actual tab
function refresh_users_actualtab(index){
    var userBox=document.getElementById("onlineUsers");
    userBox.innerHTML="";   //Clear out the list
    //Iterate through the list of users and add them one by one
    for(var i=0;i<tabs[index].tab_users.length;i++){
        var temp_name= "option_user_container"+i;
        //creating the container
        var main_container = document.createElement("div");
            main_container.setAttribute("class","user_container");
        var main_user_on = document.createElement("div");  // this is the "button"
            //main_user_on.setAttribute("id","id_user_on"+i);   
            main_user_on.setAttribute("class","user_on");  
            main_user_on.setAttribute("onclick","user_on_click('"+temp_name+"')");  
            var name_user = document.createTextNode(tabs[index].tab_users[i]);
            main_user_on.appendChild(name_user);
        //appending the user_on to the main_container
        main_container.appendChild(main_user_on);
     
        var main_option_user_container = document.createElement("div");
            main_option_user_container.setAttribute("class","option_user_container");   
            main_option_user_container.setAttribute("id",temp_name);    	 
        //appending the options to the option_user_container
        //Do not add the pm or ignore options if this is the current user
        if(tabs[index].tab_users[i]!=username){
            var option1 = document.createElement("div");
            option1.setAttribute("id","p_msg_"+i);
            //option1.setAttribute("class","my_p_msg");
            option1.setAttribute("onclick","before_add_me_Click('"+tabs[index].tab_users[i]+"')");   
            var text_option_1 = document.createTextNode('Send priv. msg');
            option1.appendChild(text_option_1);
     
            var option2 = document.createElement("div");
            //option2.setAttribute("id","p_msg_"+i);
            //option2.setAttribute("class","my_p_msg");
            //option2.setAttribute("onclick","before_add_me_Click('"+users[i]+"')");   
            var text_option_2 = document.createTextNode('Ignore');
            option2.appendChild(text_option_2);       	 
            main_option_user_container.appendChild(option1);
            main_option_user_container.appendChild(option2);
            //appending the option_user_container to the main_container
        }   	 
        main_container.appendChild(main_option_user_container);   
        //appending the main_container with all the stuff inside
        userBox.appendChild(main_container);
        userBox.innerHTML += "<br />";   	 
    }
    console.log("Users refreshed!");    
}
/*****************************************************/
//Refreshes the list of users online
function refreshUsers(data){
    var room= data["room"];
    var index= finding_tab_byname(room);
    if ( index >= 0 && data["others"]!= null){
        tabs[index].tab_users= data["others"];
        if (tabs[index].tab_status){   // if the room is the actual tab
            refresh_users_actualtab(index);
        }
    }else{
        console.log("something went wrong index: "+ index+"; tab_users: "+data["others"]+";");
    }
};
/*****************************************************/
//Refreshes the list of public chat rooms
function refresh_rooms(){
    //Get the space where we'll display the chat rooms
    var chatList=document.getElementById("chatrooms");
    console.log("Refreshing chatrooms");
    console.log("chatrooms:"+public_chatrooms);
    chatList.innerHTML="Chat-Rooms"; //Clear out the current list
    //For each chatroom, we'll create a menu
    for(var i=0;i<public_chatrooms.length;i++){
        var room_container = document.createElement("div");
        room_container.setAttribute("id","join_chat"+i);
        room_container.setAttribute("class","my_chatroom");
        // OJO con el ONCLICK no deberia ser add_me_chatroom DEBERIA ser JoinChattoom para hacer el pedido al server
        room_container.setAttribute("onclick","join_chatroom('"+public_chatrooms[i]+"')");  
        var room_text = document.createTextNode(public_chatrooms[i]);
    	room_container.appendChild(room_text);        
    	chatList.appendChild(room_container);
    	chatList.innerHTML += "<br />";   	 
	}//for i
}
/*****************************************************/    
function user_on_click(element_id) {
    // this part remove all the "show" from any older click
    var t0 = document.getElementsByClassName("option_user_container");
   	//Removed to avoid pop up when user clicks on their own name
   	for (var i = 0; i < t0.length; i++) {
       	var t1 = t0[i];
       	t1.classList.remove('show');    
   	}  
	document.getElementById(element_id).classList.add("show");  // it was a toggle, but it didnt work propperly
}
/*****************************************************/
// Close the menu if the user clicks outside of it
window.onclick = function(event) {
    var dropdowns; //Variable to hold the menu elements
	if (!event.target.matches('.user_on')) { //this is when I click outside any user_on to make dissapear the little menu
    	dropdowns = document.getElementsByClassName("option_user_container");
    	//if(dropdowns.length==0) alert(dropdowns.length);
    	for (var i = 0; i < dropdowns.length; i++) {
        	var open_my_p_msg = dropdowns[i];
        	var temp1 = open_my_p_msg.classList.item(0);
        	if (open_my_p_msg.classList.contains('show')) {
            	open_my_p_msg.classList.remove('show');
        	}
    	}
	}
    //Hide the chatroom menu if they didn't click a chatroom
    if (!event.target.matches('.chat_on')) { //If it's not a chatroom
        //Get the list of chatroom options
        dropdowns = document.getElementsByClassName("option_chat_container");
        //For each item in the menu
    	for (var i = 0; i < dropdowns.length; i++) {
        	//If it contains the "show" class
            if (dropdowns[i].classList.contains('show')) {
                //Remove it (i.e. hide it)
            	dropdowns[i].classList.remove('show');
        	}
    	}
    }
}  
/*****************************************************/
//Sends a chat message to the server
function sendMessage(){
	var input=document.getElementById("userMessage"); //Get the message from the input box
	var textLength = input.value.length;
    var room="";
    //alert(input.value);	 
	if (input.value!= null && input.value != "" ){
    	var tab_id="";    
    	for(var i=0;i<tabs.length;i++){    
        	if (tabs[i].tab_status== true){
            	tab_id= tabs[i].id_name;
            	break;
        	}
    	}
    	if(tab_id!=""){     	 
        	//getting the name of the tab
        	for(var i=0;i<tabs.length;i++){    
            	if (tabs[i].id_name == tab_id ){
                	var tab_name= tabs[i].tab_name;
                	break;
            	}
        	}
    	}    
        if(tab_name!=null){
        	var recipient=finding_name(tab_name);
            var room_flag = false; //Flag for whther or not a tab is a room
            //Check to see if it is a room
            for(var i=0;i<public_chatrooms.length;i++){
                //If we have a match
                if(tab_name==public_chatrooms[i]){
                    room=public_chatrooms[i];   					 
                    //Set the flag
                    room_flag=true;
                    break; //And break out of the loop
                }
            }
            if(!room_flag){ //if is a private message
                console.log("sending pm: "+ellipse(input.value, max_valor_msg));   	 
                socket.emit("newPrivateMessage", {message:ellipse(input.value, max_valor_msg), user:recipient});
            } else {
                console.log("sending "+input.value+" to "+room);
                //Send it to the server as a message
                socket.emit("messageToServer", {message:ellipse(input.value, max_valor_msg), room:room});  
            }
    	}
	}
	input.value=""; //Clear out the text
}
/*****************************************************/
//Sends the server an updated username
function updateName(){
	var input=document.getElementById("userid");
	var textLength = input.value.length;
	if (input.value!= null && input.value != "" ){
    	if(textLength>max_valor_username){
        	alert("Error: Name exceeds " + max_valor_username + " characters long");
        	input.value=input.value.substring(0,max_valor_username);
    	}else{
        	//Display what we're sending to the log
        	console.log("New name "+input.value);
        	//Send our emssage to the server
        	socket.emit("newName", {updatedName:input.value});   
    	}
	}
}
/*****************************************************/
function ellipse(str, max){
	return str.length > (max - 3) ? str.substring(0,max-3) + '...' : str;
}
/*****************************************************/   
function finding_name(my_str) {
	var the_user_name="";
	var pos = my_str.indexOf("_");
	if ( my_str.substring(0,pos)==username){
    	the_user_name=my_str.substring(pos+1,my_str.length);
	}else{
    	the_user_name=my_str.substring(0,pos);   	 
	}
	return the_user_name;
}
/*****************************************************/   
function finding_tab_byname(the_tab_name){
	var pos = -1;
	for(var i=0;i<tabs.length;i++){    
    	if(the_tab_name==public_chatrooms[i]){
        	if (tabs[i].tab_name == the_tab_name){
            	pos=i;
            	break;
        	}	 
   	 }else if (finding_name(tabs[i].tab_name) == the_tab_name && the_tab_name!=username){
            	pos=i;
            	break;
    	}
    }
	return pos;
}
/*****************************************************/   
function refreshing_modal(i){
	//alert(tabs[i]);
	if(tabs[i]!=null){
    	var chatbox=document.getElementById("myModal"); //chatbox is the <p>   
    	chatbox.innerHTML= tabs[i].tab_log;
    	chatbox.scrollTop = chatbox.scrollHeight; //Scroll to the bottom    
	}
}
/*****************************************************/
function add_date(data){
    var my_date= "<span class='my_time'>"+data["time"]+"<p class='my_day'>"+data["day"]+"</p></span>";
    //var my_date= "<span class='my_time'>"+data["day"]+"</span>";
    
    return my_date;
}
/*****************************************************/
   
function write_in_chat(type,data){
	//So here we must to feed the logs and refresh the chatbox depening of the actual tab kind
	// and find where (which tab) put the message, and wich tab refresh (actual tab)
	if(type=="0"){ //message by user
//    	io.to(data["room"]).emit('messageFromServer', { type:"0", sender:username, message:data["message"],time:timestamp,day:t_day, room:data["room"] });
    	var tab_i= finding_tab_byname(data["room"]);
    	if(tab_i>=0){
            // using anchorme.js("text who might contains links") to make it clickable
        	tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+data["sender"]+":</span>  "+anchorme.js(data["message"])+add_date(data)+"</span>";
        	if (tabs[tab_i].tab_status== true){
            	refreshing_modal(tab_i);
            }
    	}
	}else if(type=="4"){ // system msg: user changed name
        console.log("Changed name\n");
        //updating all chat-rooms 
        if(data.kind=="public"){
            var tab_i = public_chatrooms.indexOf(data["room"]);
            if(tab_i >= 0){
                tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+data["oldName"]+" has changed their name to "+data["newName"]+add_date(data)+"</span>";
                if (tabs[tab_i].tab_status== true){
                    refreshing_modal(tab_i);
                }
            }
        }else if(data.kind=="private") {
            var tab_i= finding_tab_byname(data["oldName"]);
            console.log("tab_i: "+tab_i);
            if(tab_i>=0){ //updating private msg log
                tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+data["oldName"]+" has changed their name to "+data["newName"]+add_date(data)+"</span>";
                if (tabs[tab_i].tab_status== true){
                    refreshing_modal(tab_i);
                } else {
                    document.getElementById(tabs[tab_i].id_name).classList.add("newMsg");
                }   		 
            }
        }
	}else if(type=="2"){ // system msg: new user connected
        var tab_i= finding_tab_byname(data["room"]);
        //updating all chat-rooms 
        for(var i=0;i<public_chatrooms.length;i++){
            if( i == tab_i){
                //alert(i+" "+public_chatrooms[i]);
                tabs[tab_i].tab_log +=  "<br /><span class='systemMsg'>"+data["name"]+" has connected."+add_date(data)+"</span>";
                if (tabs[tab_i].tab_status== true){
                    refreshing_modal(tab_i);
                }
            }
        }
	}else if(type=="5"){ // system msg: private msg
    	var tab_i= finding_tab_byname(data["sender"]);
    	//alert(msg1 +" "+tab_i);   	 
    	if(tab_i>=0){ //updating private msg log
        	tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+data["sender"]+":</span>  "+anchorme.js(data["message"])+add_date(data)+"</span>";
        	if (tabs[tab_i].tab_status== true){
            	refreshing_modal(tab_i);
        	} else {
   			 document.getElementById(tabs[tab_i].id_name).classList.add("newMsg");
            }
    	}else{ //creating the new tab for priv. msg
        	btn_add_me_Click(data["sender"]);
        	tab_i= finding_tab_byname(data["sender"]);
        	//alert(data["sender"]+" "+tab_i);
        	tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+data["sender"]+":</span>  "+anchorme.js(data["message"])+add_date(data)+"</span>";
        	if (tabs[tab_i].tab_status== true){
            	refreshing_modal(tab_i);
        	}
    	}   	 
	}else if(type=="6"){
    	var tab_i= finding_tab_byname(data["recipient"]);
    	//alert(msg2 +" "+tab_i);
    	tabs[tab_i].tab_log += "<br /><span class='userMsg'><span class='username'>"+data["sender"]+":</span>  "+anchorme.js(data["message"])+add_date(data)+"</span>";
    	refreshing_modal(tab_i);   	 
	}else if(type=="7" ){
    	var tab_i= finding_tab_byname(data["room"]);    
    	tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+data["name"]+" has left the room."+add_date(data)+"</span>";
        if (tabs[tab_i].tab_status== true){
            refreshing_modal(tab_i);
        }        
    }else if(type=="3"){
        //write_in_chat(typeReceived,{leaving_user,time});  //user disconected -warning- is not the same like closing tab
        var tab_i= finding_tab_byname(data["leaving_user"]);
        if (tab_i >= 0 ){
            if(tabs[tab_i].user_status){ // receiver status is still available, we didnt send dc'd msg alert
                tabs[tab_i].user_status=false; // changed the status for dc'd
                tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+data["leaving_user"]+" has disconnected."+add_date(data)+"</span>";
                if (tabs[tab_i].tab_status== true){ // WARNING we might not want to refresh the users, just make the dc'd one gray or unabled
                    refreshing_modal(tab_i);
                }else{
                    document.getElementById(tabs[tab_i].id_name).classList.add("newMsg");                
                }        
            }    
        }else{
            console.log("Error en índice del tab usando búsqueda por nombre: "+ data["leaving_user"]);
        }
    } else if(type=="8"){
    	var tab_i= finding_tab_byname(data["recipient"]);
    	//alert(msg1 +" "+tab_i);   	 
    	if(tab_i>=0){ //updating private msg log
            tabs[tab_i].tab_log += "<br /><span class='systemMsg'>"+data["message"]+add_date(data)+"</span>";
        	if (tabs[tab_i].tab_status== true){
            	refreshing_modal(tab_i);
        	} else {
   			 document.getElementById(tabs[tab_i].id_name).classList.add("newMsg");
            }
    	}        
        
    }  
}
/*****************************************************/  	 
function testing(event){
	socket.emit("newChatRoom", {name:"testRoom", users:username});
}
/*****************************************************/
function destroy_me_Click(event) {
    //with this i get the id name of the X object im clicking
	var my_id=this.getAttribute("id");
	//alert (my_id);
	var temp_tabs=[];
	//with this for i get the info from the tabs manager  
	for(var i=0;i<tabs.length;i++){   	 
   	 //When it is found
    	if(my_id==tabs[i].clsx_name){  
        	var a_tab = document.getElementById(tabs[i].id_name);
        	var the_tab_holder = document.getElementById("tab_holder");    	 
        	//alert(my_id +", " + tabs[i].id_name);
            //here we must inform the server if we are leaving a ChatRoom            
            if ("1"==tabs[i].tab_kind){
                //alert(tabs[i].tab_kind=='1');
                //alert("Leaving chat room: "+tabs[i].tab_name);
                console.log("Leaving chat room: "+tabs[i].tab_name);
               	socket.emit("LeaveChatRoom", {name:tabs[i].tab_name});
            }            
        	if(the_tab_holder.childElementCount > 0){
                //with this we remove the event "on click" just before the tab deleting
                a_tab.removeAttribute("onclick","dialog_on_click('"+tabs[i].id_name+"')");             	 
            	the_tab_holder.removeChild(a_tab);
        	}
        	//now i must delete the info from the tabs
            var flag_alert = tabs[i].tab_status;
        	tabs.splice(i,1);
            //Now set the focus on the next tab
            //Swap to one to the right or to the left most if none are to the right
            //Start by making sure there are tabs left
            if(tabs.length>0){
                if(flag_alert){
                     //Case where we deleted the right most tab
                    if(tabs.length==i){
                        //Swap the tab to the left
                        dialog_on_click(tabs[i-1].id_name);
                        //Case where we did not delete the right most tab
                    } else {
                        //Swap to the next tab
                        dialog_on_click(tabs[i].id_name);
                    }                   
                }
            } else { //If there are no tabs left, clear the chat area
                var chatArea=document.getElementById("myModal");
                chatArea.innerHTML=""; //Remove the conversation history
                var usersArea=document.getElementById("onlineUsers");
                usersArea.innerHTML=""; //Remove the conversation history
            }
        	break; //And exit the loop "for i"
        }    
    } 
    //Check to see if there are too many tabs
    setTabButtons();    
    //Show the new tab
    showRightMostTabs();    
}
/*****************************************************/  	 
function add_me_chatroom(chat_name, chat_users, chat_kind){
	//alert(chat_name);
    //First check that this chatroom doesn't already have a tab, If not -> create a tab
	var flag_tab = false;
	for(var i=0;i<tabs.length;i++){    
    	if (tabs[i].tab_name== chat_name){
        	var old_tab_id_name = tabs[i].id_name;
        	flag_tab = true;
            console.log("Tab found");
        	break;
    	}
	}
	if (!flag_tab){
    	tab_total_count+=1;
    	var new_tab = {
        	tab_name : chat_name,
        	id_name : "Tab_"+tab_total_count,
        	clsx_name: "Cls_"+tab_total_count,
        	tab_log : "WELCOME to -MY CHAT- American Server! :)<br />"+"        ***   "+chat_name+" room   ***",
            tab_kind: "1",// 1 means public chat room
            tab_users: chat_users,
        	tab_status : true
    	};
        console.log("Joining chat room");
    	tabs.push(new_tab);
    	var the_tab_holder = document.getElementById("tab_holder");
    	var tab = document.createElement("aside");
        var text_id_tab = document.createTextNode(chat_name);
        tab.appendChild(text_id_tab);
    	tab.setAttribute("id",new_tab.id_name);
    	tab.setAttribute("class","mytab");
    	tab.setAttribute("onclick","dialog_on_click('"+new_tab.id_name+"')");  
    	the_tab_holder.appendChild(tab);
    	var closing_x = document.createElement("span");
    	var text_symbol_close = document.createTextNode('x');
    	closing_x.appendChild(text_symbol_close);
    	closing_x.setAttribute("class","close-x");
    	closing_x.setAttribute("id",new_tab.clsx_name);
    	tab.appendChild(closing_x);
    	closing_x.addEventListener('click', destroy_me_Click);  
        //Dynamically figure out the width
        var width=tab.clientWidth+closing_x.clientWidth+5;
        //Set the width
        tab.setAttribute("style","width:"+width+"px");
    	dialog_on_click(new_tab.id_name); // adds the focus to the lastest created (or just the new one)
	}else{
    	dialog_on_click(old_tab_id_name); // adds the focus to the tab that has the user we want to talk and was created before
	}
}

/*****************************************************/  	 
function before_add_me_Click(the_user_name){

 btn_add_me_Click(the_user_name);
 var index= finding_tab_byname(the_user_name);
 console.log(index);
 dialog_on_click(tabs[index].id_name); // adds the focus to the lastest created (or just the new one)
 
 

}/*****************************************************/  	 
function btn_add_me_Click(the_user_name){
	//alert(the_user_name);
	//first we must check that we dont have a priv. msg (or prev tab)
	//with this person, if we dont, we created a tab and everything
	var flag_tab = false;
	for(var i=0;i<tabs.length;i++){    
    	if (tabs[i].tab_name== username+"_"+the_user_name){
        	var old_tab_id_name = tabs[i].id_name;
        	//alert("already exists");
        	flag_tab = true;
        	break;
    	}
	}
	if (!flag_tab){
    	tab_total_count+=1;
    	var new_tab = {
        	tab_name : username+"_"+the_user_name,
        	id_name : "Tab_"+tab_total_count,
        	clsx_name: "Cls_"+tab_total_count,
        	tab_log : "",
        	tab_status : false,
            tab_users: [the_user_name, username],
            user_status: true, // true: means the receiver user is online / false: means receiver user is dc'd
            tab_kind: "2"  // 2 means private chat
    	};
    	tabs.push(new_tab);
    	var the_tab_holder = document.getElementById("tab_holder");
    	var tab = document.createElement("aside");
    	// this text should change to a user2 name (the user that actually is talking to you)  	 
        var text_id_tab = document.createTextNode(the_user_name);
        tab.appendChild(text_id_tab);
    	tab.setAttribute("id",new_tab.id_name);
    	tab.setAttribute("class","mytab");
    	tab.setAttribute("onclick","dialog_on_click('"+new_tab.id_name+"')");  
    	the_tab_holder.appendChild(tab);
    	var closing_x = document.createElement("span");
    	var text_symbol_close = document.createTextNode('x');
    	closing_x.appendChild(text_symbol_close);
    	closing_x.setAttribute("class","close-x");
    	closing_x.setAttribute("id",new_tab.clsx_name);
    	tab.appendChild(closing_x);
    	closing_x.addEventListener('click', destroy_me_Click);
        //Dynamically figure out the width
        var width=tab.clientWidth+closing_x.clientWidth+5;
        //Set the width
        tab.setAttribute("style","width:"+width+"px");

        if(tabs.length==1){ //means this is the only tab created, must to be focussed
            dialog_on_click(new_tab.id_name); // adds the focus to the lastest created (or just the new one)
        }
	}else{
    	dialog_on_click(old_tab_id_name); // adds the focus to the tab that has the user we want to talk and was created before
	}
    //Check to see if there are too many tabs
    setTabButtons();    
    //Show the new tab
    showRightMostTabs();
}    
/*****************************************************/    
function dialog_on_click(tab_id){
	//alert("entre: "+tab_id);
    var temp_list = document.getElementsByClassName("mytab"); // New List with all tabs
    for(var k=0; k< temp_list.length; k++){  //starting to check all the tabs
    	var temp = temp_list[k];
    	var t3= temp.getAttribute("id"); // a tab
    	if (temp.classList.contains('mytab2') && tab_id!=t3) {
        	temp.classList.remove('mytab2');
    	}   	 
    }    
	if (document.getElementById(tab_id)!=null){
    	//alert("aqui-> "+tab_id);
    	document.getElementById(tab_id).classList.add("mytab2");
    	for(var i=0;i<tabs.length;i++){    
        	if (tabs[i].id_name== tab_id){
            	tabs[i].tab_status = true;
                //If the tab contains had a newMsg notification
                //Remove it when it is clicked upon selecting it
                var current_tab=document.getElementById(tab_id);
                if (current_tab.classList.contains('newMsg')) {//If it has the newMsg class
                    current_tab.classList.remove('newMsg'); //Remove it
                }
                refresh_users_actualtab(i);
              	refreshing_modal(i);           	 
        	}else{
            	tabs[i].tab_status = false;
        	}    
    	}    	 
	}
}
/*****************************************************/    
//Asks the server to join a chat room
function join_chatroom(chat_name, chat_kind){
    var index = finding_tab_byname(chat_name); 
    if(-1== index){ //If we aren't already part of the chat
        //alert(chat_name);
        //WARNING we should not send our username here
        socket.emit("newChatRoom", {user:username, room:chat_name,kind: chat_kind,password:""});
    }else{
    	dialog_on_click(tabs[index].id_name); // adds the focus to the tab 
    }
} 
/*****************************************************/
function checkTabVisibility(tab_id){
    var tabHolder=document.getElementById("tab_bar");
    
    //Check to see if the browser supports the method
    if(tabHolder.getBoundingClientRect){
   	 
   	 //Get the borders for the tab bar
   	 var borders=tabHolder.getBoundingClientRect();
   	 var x=borders.left;
   	 var y=borders.top;
   	 
   	 var width=borders.right-borders.left;
   	 var height=borders.bottom-borders.top;
   	 
   	 
   	 var current=document.getElementById(tab_id);
   	 var tabBorders=current.getBoundingClientRect();
   		 
   	 var top=tabBorders.top;
   	 var bottom=tabBorders.bottom;
   	 var left=tabBorders.left;
   	 var right=tabBorders.right;
   	 
   	 //leftTabButtons, rightTabButtons
   	 
   	 //Get the borders for the buttons if visible
   	 var leftButtons=document.getElementById("leftTabButtons");
   	 var rightButtons=document.getElementById("rightTabButtons");
   	 
   	 //If the left buttons are visible, adjust for it
   	 if(false==leftButtons.classList.contains("hidden_tab")){
   		 //Get the width of the buttons' div
   		 var leftAdjust=leftButtons.offsetWidth;
   		 //And adjust for it
   		 left=left-leftAdjust-2;
   	 }
   	 
   	 //Do the same on the right side
   	 
   	 //If the right buttons are visible, adjust for it
   	 if(false==rightButtons.classList.contains("hidden_tab")){
   		 //Get the width of the buttons' div
   		 var rightAdjust=rightButtons.offsetWidth;
   		 //And adjust for it
   		 right=right+rightAdjust+5;
   	 }
   		 
   	 //Check to see if it is within the tab border
   	 if(top>=borders.top && left>=borders.left && bottom<=borders.bottom
   		 && right <=borders.right ){
   			 
   			 //If it is, return true
   			 return true
   	 }
   	 
   	 //If it is not, false is returned
   	 return false;
    }
}
/*****************************************************/
//Adds the hidden_tab class to all tabs
//Meant to be used in conjuction with another function
function hideAllTabs(){
    var currentTab; //The current tab
    
    //For each tab
    for(var i=0;i<tabs.length;i++){
   	 //Get the tab
   	 currentTab=document.getElementById(tabs[i].id_name);
   	 //If it is not already hidden
   	 if(false===currentTab.classList.contains("hidden_tab") ){
   		 //Hide it
   		 currentTab.classList.add("hidden_tab");
   	 }
    }
}
/*****************************************************/
//Shows the leftmost tabs
function showLeftMostTabs(){
    //First, hide the tabs to ensure a clean slate
    hideAllTabs();
    
    var id; //The id used to identify the tab
    var currentTab; //The current tab    
    var oneTabVisible=false; //Flag to make sure at least 1 tab is visible
    
    for(var i=0;i<tabs.length;i++){
   	 //Get the id for convenience
   	 id=tabs[i].id_name;
   	 //Get the current tab
   	 currentTab=document.getElementById(id);
   	 //Unhide it by removing the hidden_tab class
   	 currentTab.classList.remove("hidden_tab");
   	 
   	 //Check to see if it is visible.
   	 if(!checkTabVisibility(id)){
   		 //If not, readd the hidden_tab class
   		 currentTab.classList.add("hidden_tab");
   		 
   		 //If it is not visible, check to see if there is at least 1 other tab
   		 //that is visible.
   		 if(oneTabVisible){
   			 //If there is, break out of the loop (and essentially return)
   			 break;
   		 }
   	 //If it is visible
   	 } else {
   		 //Display it if it's the leftmost one
   		 if(false==oneTabVisible) dialog_on_click(id);
   		 
   		 //And note that there is a visible tab
   		 oneTabVisible=true;
   		 
   	 }
    }
}
/*****************************************************/
//Shows the rightmost tabs
function showRightMostTabs(){
    //First, hide the tabs to ensure a clean slate
    hideAllTabs();
    
    var id; //The id used to identify the tab
    var currentTab; //The current tab    
    var rightMostTab; //The rightmost tab that's visible
    var oneTabVisible=false; //Flag to make sure at least 1 tab is visible
    var rightMostID=""; //ID of the tab that is the rightmost visible tab
    var i=tabs.length-1; //Counter variable; starts at the end and goes to 0
    
    //While i is not yet below 0
    while(i>=0){
   	 //Get the id for convenience
   	 id=tabs[i].id_name;
   	 
   	 //Get the tab itself
   	 currentTab=document.getElementById(id);
   	 
   	 //Unhide it by removing the hidden_tab class
   	 currentTab.classList.remove("hidden_tab");
   	 
   	 //If the tab is visible
   	 if(true===checkTabVisibility(id)){
   		 //Mark it as the rightmost tab
   		 rightMostTab=currentTab;
   		 
   		 //And display it
         console.log('Forced showing tab');//ROSSI remove this
   		 dialog_on_click(id);
   		 
   		 break; //And break out of the loop
   	 //If it is not visible (i.e. it doesn't fit), re-hide it
   	 } else {
   		 currentTab.classList.add("hidden_tab");
   	 }
   	 
   	 //Decrease i and check the next tab
   	 i--;
    }
    
    //If rightMostTab was never initialized, there are either no tabs at all
    //Or none of them fit in the tab area
    if(null == rightMostTab){
   	 return; //So return now
    }
    
    i--; //Decrease i and move onto the next tab before moving on
    
    //Now rightMostTab is defined, loop through and unhide tabs until it gets hidden
    while(i>=0){
   	 //Get the id for convenience
   	 id=tabs[i].id_name;
   	 
   	 //Get the tab itself
   	 currentTab=document.getElementById(id);
   	 
   	 //Unhide it by removing the hidden_tab class
   	 currentTab.classList.remove("hidden_tab");
   	 
   	 //Check to see if the rightmost tab is still visible or not
   	 if(false===checkTabVisibility(rightMostTab.id)){
   		 
   		 //IF not, re-hide the tab
   		 currentTab.classList.add("hidden_tab");
   		 
   		 break; //And break out of the loop
   	 }
   	 
   	 //Decrease i and check the next tab
   	 i--;
    }
}
/*****************************************************/
//Function to navigate left in the tab bar
function showLeftTab(){
    //Start by checking to make sure the first tab is not hidden
    //Get the tab
    var currentTab=document.getElementById(tabs[0].id_name);
    
    //If it is not hidden, there is nothing to do
    if(false==currentTab.classList.contains("hidden_tab")) return;
    
    var i=1; //Index variable
    var showNewTab=false; //Flag to hold if a new tab needs to be displayed    
    
    //Go through each tab
    while(i<tabs.length){
   	 
   	 //Get the current tab
   	 currentTab=document.getElementById(tabs[i].id_name);
   	 
   	 
   	 //If it does not have the hidden_tab class
   	 if(false==currentTab.classList.contains("hidden_tab")){
   		 
   		 //Go back a tab
   		 currentTab=document.getElementById(tabs[i-1].id_name);
   		 //And remove the class hiding it
   		 currentTab.classList.remove("hidden_tab");
   		 
   		 //Show the tab
   		 //dialog_on_click(tabs[i-1].id_name);
   		 
   		 //And break out of the loop
   		 break;
   	 }
   	 
   	 i++
    }
    
    //console.log("Check1");
    
    //Flag to hold whether or not a tab is viewable
    var visibilityFlag=true;
    
    var lastVisible=-1; //Variable to hold where the last visible tab is
    
    //Next, reapply the hidden_tab class to any now hidden tabs
    while(i<tabs.length){
   	 //console.log(i+"/"+tabs.length);
   	 
   	 //Check to see if the tab is visible
   	 visibilityFlag=checkTabVisibility(tabs[i].id_name);
   	 
   	 //If the current tab is not visible
   	 if(false==visibilityFlag){
   		 
   		 //Check to see if it is the active tab
   		 //(I.e. if the active tab is not visible)
   		 if(tabs[i].tab_status){
   			 showNewTab=true;
   		 }
   		 
   		 //Update lastVisible if it  is still -1
   		 if(-1===lastVisible) lastVisible=i-1;
   		 
   		 //Get the current tab
   		 currentTab=document.getElementById(tabs[i].id_name);
   		 
   		 //And add the class to the tab for record keeping if needed
   		 if(false===currentTab.classList.contains("hidden_tab")){
   			 
   			 //And add it to the tab for record keeping
   			 currentTab.classList.add("hidden_tab");
   		 }
   		 
   		 //And break out of the loop
   		 //break;
   	 }
   	 
   	 //Update i
   	 i++;
    }
    
    //If needed, show a new tab
    if(showNewTab) dialog_on_click(tabs[lastVisible].id_name);
    
}
/*****************************************************/
//Function to navigate right in the tab bar
function showRightTab(){
    
    //Start by checking to make sure the last tab is not hidden
    
    //Initialize i
    var i=tabs.length-1;
    
    //console.log("i: "+i);
    //console.log("id: "+tabs[i].id_name);
    //Get the tab
    var current_tab=document.getElementById( tabs[i].id_name );
    
    console.log("tabs[i]: "+JSON.stringify(tabs[i]));
    console.log("current_tab: "+JSON.stringify(current_tab));
    console.log("classList: "+current_tab.classList);
    
    //If it is not hidden, there is nothing to do
    if(false==current_tab.classList.contains("hidden_tab")) return;
    
    //Decrement i to avoid checking it again
    i--;
    
    var showNewTab=false; //Flag to hold if a new tab needs to be displayed    
    
    //While it is not at the start
    //I.e. go through each tab in reverse order
    while(i>=0){
   	 
   	 //Get the current tab
   	 current_tab=document.getElementById(tabs[i].id_name);
   	 
   	 //If it does not have the hidden_tab class
   	 if(false==current_tab.classList.contains("hidden_tab")){
   		 
   		 //Go to the next tab
   		 current_tab=document.getElementById(tabs[i+1].id_name);
   		 //And remove the class hiding it
   		 current_tab.classList.remove("hidden_tab");    
   		 current_tab.focus();
   		 //Break out of the loop
   		 break;
   	 }
   	 
   	 //Decrease i to check the next tab
   	 i--;
    }
    
    //The next will now show if there is room.
    //The next step is to then hide tabs on the left until there is room
    
    var j=0; //Index variable
    
    //While it is still not at the rightmost tab left
    while(j<tabs.length){
   	 //Get the current tab
   	 current_tab=document.getElementById(tabs[j].id_name);
   	 
   	 //And check if it is hidden (has the hidden_tab class)
   	 //If not
   	 if(false==current_tab.classList.contains("hidden_tab")){
   		 
   		 //Show the tab
   		 //dialog_on_click(tabs[i-1].id_name);
   		 
   		 //And break out of the loop
   		 break;
   	 }
   	 //Update the index
   	 j++;
    }
    
    //var lastVisible=i;
    
    //While the desired tab is still not visible
    //And j does not go ut of bounds (i.e. try to hide tab[i+1])
    while(false==checkTabVisibility(tabs[i+1].id_name) && j<=i ){
   	 //Get the leftmost visible tab
   	 current_tab=document.getElementById(tabs[j].id_name)
   	 
   	 //If the current tab is the active one, activate the next one
   	 if(tabs[j].tab_status){
   		 //console.log("Making visible: "+tabs[j].id_name);
   		 dialog_on_click(tabs[j+1].id_name);
   	 }
   	 //And hide the current tab
   	 current_tab.classList.add("hidden_tab");
   	 
   	 //Go to the next tab
   	 j++;
    }
}
/*****************************************************/
//Checks to see if all the tabs are visible by checking the first and last tabs
function setTabButtons(){
    var hiddenTabs=[]; //Array to hold whether the tab was hidden or not
    var currentTab; //The current tab being processed
    
    //Go through and record whether the tabs are hidden or not and unhide them
    for(var i=0;i<tabs.length;i++){
   	 //Get the current tab
   	 currentTab=document.getElementById(tabs[i].id_name);
   	 
   	 //Check if it is hidden
   	 var check=currentTab.classList.contains("hidden_tab");
   	 //Record whether or not it had the class
   	 hiddenTabs.push(check);
   	 //If it does have the class, remove it
   	 if(check) currentTab.classList.remove("hidden_tab");
   	 
    }
    
    
    //Hide them and assume there is enough space
    var buttons=document.getElementById("leftTabButtons"); //Get the left side
    buttons.classList.add("hidden_tab"); //Hide it
    
    buttons=document.getElementById("rightTabButtons");
    buttons.classList.add("hidden_tab");
    
    var firstTabID=tabs[0].id_name;
    var firstFlag=checkTabVisibility(firstTabID);
    
    //If the first tab is not visible, show the buttons and return
    if(false==firstFlag){
   	 
   	 //Go through and readd the hidden_tab class as needed
   	 for(var i=0;i<tabs.length; i++){
   		 //Get the tab
   		 currentTab=document.getElementById(tabs[i].id_name);
   		 //If it was previously marked as having the class, re add it
   		 if(hiddenTabs[i]) currentTab.classList.add("hidden_tab");
   	 }
   	 
   	 buttons=document.getElementById("leftTabButtons");
   	 buttons.classList.remove("hidden_tab");
   	 
   	 buttons=document.getElementById("rightTabButtons");
   	 buttons.classList.remove("hidden_tab");
   	 
   	 return;
    }
    
    var lastTabID=tabs[tabs.length-1].id_name;
    var lastFlag=checkTabVisibility(lastTabID);
    
    //Repeat for the last tab
    if(false==lastFlag){
   	 //Go through and readd the hidden_tab class as needed
   	 for(var i=0;i<tabs.length;i++){
   		 //Get the tab
   		 currentTab=document.getElementById(tabs[i].id_name);
   		 //If it was previously marked as having the class, re add it
   		 if(hiddenTabs[i]) currentTab.classList.add("hidden_tab");
   	 }
   	 
   	 buttons=document.getElementById("leftTabButtons");
   	 buttons.classList.remove("hidden_tab");
   	 
   	 buttons=document.getElementById("rightTabButtons");
   	 buttons.classList.remove("hidden_tab");
   	 
   	 return;
    }
    
    //dialog_on_click(tabs[i].id_name);
    
}
/*****************************************************/
//Function designed to show a new tab after one has been deleted
function showAnotherTab(){
    //Start by checking to make sure the first tab is not hidden
    
    //Get the first and last tab
    var firstTab=document.getElementById(tabs[0].id_name);
    var lastTab=document.getElementById(tabs[tabs.length-1].id_name);
    
    //If the left most tab is hidden, show a tab on the left
    if(true==firstTab.classList.contains("hidden_tab")){
   	 showLeftTab();
    //Otherwise, if the last tab is hidden, show a tab on the right
    } else if(true==lastTab.classList.contains("hidden_tab")){
   	 showRightTab();
    }
    //If both are visible, do nothing
}
/*****************************************************/


