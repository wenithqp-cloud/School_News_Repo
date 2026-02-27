let siteData = { heroContent:{}, videos:[], teamMembers:[], newsItems:[], joinRequests:[] };

// ================ FETCH SITE DATA =================
async function loadSiteData(){
  const res = await fetch("/getSiteData");
  siteData = await res.json();
  loadHero();
  loadVideos();
  loadTeamMembers();
  loadNewsBar();
  loadJoinRequests();
  document.querySelectorAll("section").forEach(s=>s.classList.add("visible"));
}

// ================ SAVE SITE DATA =================
async function saveSiteData(){
  const res = await fetch("/updateSiteData", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(siteData)
  });
  const result = await res.json();
  if(result.success) alert("Saved successfully!");
}

// ================ HERO =================
function loadHero(){const hero=siteData.heroContent;document.querySelector(".hero h1").textContent=hero.title||"Welcome";document.querySelector(".hero p").textContent=hero.desc||"";document.querySelector(".hero button").textContent=hero.btn||"Watch Latest Broadcast";}
function saveHero(){siteData.heroContent={title:document.getElementById("heroTitle").value,desc:document.getElementById("heroDesc").value,btn:document.getElementById("heroBtnText").value};saveSiteData();loadHero();}

// ================ VIDEOS =================
function getYouTubeEmbed(url){try{const u=new URL(url);let id=u.searchParams.get("v");if(u.hostname==="youtu.be")id=u.pathname.slice(1);return `https://www.youtube.com/embed/${id}`;}catch{return url;}}
function loadVideos(){const v=siteData.videos;const vs=document.getElementById("videoScroll");const mv=document.getElementById("mainVideo");const tDiv=document.getElementById("videoTranscript");vs.innerHTML="";if(v.length){const newest=v[v.length-1];mv.src=getYouTubeEmbed(newest.link);tDiv.textContent=newest.transcript||"No transcript available.";}[...v].reverse().forEach(video=>{const btn=document.createElement("button");btn.textContent=video.title;btn.onclick=()=>{mv.src=getYouTubeEmbed(video.link);tDiv.textContent=video.transcript||"";};vs.appendChild(btn);});}
function addVideo(){const t=prompt("Video title:");const l=prompt("YouTube link:");const tr=prompt("Transcript:");if(!t||!l)return;siteData.videos.push({title:t,link:l,transcript:tr});saveSiteData();loadVideos();}

// ================ TEAM =================
function loadTeamMembers(){const tM=siteData.teamMembers;const grid=document.getElementById("teamGrid");grid.innerHTML="";tM.forEach(m=>{const div=document.createElement("div");div.className="member";div.setAttribute("data-contact",`${m.email||""}, ${m.phone||""}`);div.innerHTML=`<img src="${m.img||"maroon.jpg"}"><h3>${m.name}</h3><p>${m.role}</p>`;grid.appendChild(div);});}
function addTeamMember(){const n=prompt("Name:"),r=prompt("Role:"),e=prompt("Email:"),p=prompt("Phone:"),img=prompt("Image URL:");if(!n||!r)return;siteData.teamMembers.push({name:n,role:r,email:e,phone:p,img});saveSiteData();loadTeamMembers();}

// ================ NEWS =================
function loadNewsBar(){const newsBar=document.getElementById("newsBar");const news=siteData.newsItems;newsBar.textContent=news.length===0?"Welcome to Eldorado News! ⚡":news.map(n=>n.text).join(" ⚡ ");}
function addNews(){const text=prompt("News text:");if(!text)return;siteData.newsItems.push({text});saveSiteData();loadNewsBar();}

// ================ JOIN =================
function submitForm(e){e.preventDefault();const name=document.getElementById("name").value,email=document.getElementById("email").value;siteData.joinRequests.push({name,email});saveSiteData();e.target.reset();alert("Request submitted!");}

// ================ UTILS =================
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:"smooth"});}
function goToNewestVideo(){if(siteData.videos.length){document.getElementById("mainVideo").src=getYouTubeEmbed(siteData.videos[siteData.videos.length-1].link);}}
window.addEventListener("load", loadSiteData);
