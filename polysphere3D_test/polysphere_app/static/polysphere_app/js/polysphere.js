let reddegrees = 0;
let greendegrees = 0;
let bluedegrees = 0;

let selected = "#imgred";

function imgred_onclick(){
    selected = "#imgred";
    reddegrees += 90;

    $('#imgred').css({
      'transform': 'rotate(' + reddegrees + 'deg)',
      '-ms-transform': 'rotate(' + reddegrees + 'deg)',
      '-moz-transform': 'rotate(' + reddegrees + 'deg)',
      '-webkit-transform': 'rotate(' + reddegrees + 'deg)',
      '-o-transform': 'rotate(' + reddegrees + 'deg)'
    });
}

function imggreen_onclick(){
    selected = "#imggreen";
    greendegrees += 90;

    $('#imggreen').css({
      'transform': 'rotate(' + greendegrees + 'deg)',
      '-ms-transform': 'rotate(' + greendegrees + 'deg)',
      '-moz-transform': 'rotate(' + greendegrees + 'deg)',
      '-webkit-transform': 'rotate(' + greendegrees + 'deg)',
      '-o-transform': 'rotate(' + greendegrees + 'deg)'
    }); 
}

function imgblue_onclick(){
    selected = "#imgblue";
    bluedegrees += 90;

    $('#imgblue').css({
      'transform': 'rotate(' + bluedegrees + 'deg)',
      '-ms-transform': 'rotate(' + bluedegrees + 'deg)',
      '-moz-transform': 'rotate(' + bluedegrees + 'deg)',
      '-webkit-transform': 'rotate(' + bluedegrees + 'deg)',
      '-o-transform': 'rotate(' + bluedegrees + 'deg)'
    }); 
}

function cell_onmousedown(event){
    // console.log(event.target);
    // console.log(event.clientX);
    // console.log(event.clientY);

    $(selected).css({
        position: "absolute",
        left: event.clientX + "px",
        top: event.clientY + "px"
    });

}