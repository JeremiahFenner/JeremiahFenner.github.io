

var fclick = true;
function callClick(){
    if(fclick == true){pushInfo();}
    else{popInfo();}
    fclick = !fclick;
}

function pushInfo(){
    // $('#aboutPage').animate({'left':'100px'},"slow");
    // document.getElementById("aboutPage").style.transition = "opacity 700ms ease-in-out";
    // document.getElementById("aboutPage").style.opacity = "1";
    // $('#aboutPage').animate({"margin-right": 0},"slow");
          
};

function popInfo(){
    // document.getElementById("aboutPage").style.transition = "opacity 700ms ease-in-out";
    // document.getElementById("aboutPage").style.opacity = "0";
    // $('#aboutPage').animate({'margin-right': -400},"slow");
};

function showInfo() {
        $(".aboutPage").toggleClass('open');
};