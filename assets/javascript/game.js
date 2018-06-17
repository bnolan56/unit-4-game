// Initial variables for game

var myHTML = [];
var clickCounter = 0;
var healthPointsArray = [170, 165, 139, 140];
var playerId;
var defenderId;
var originalAttackPowerArray = [7, 9, 8, 3];
var defenderOccupancyCounter = 0;
var victoryCounter = 0;

// Marvel Hero Objects
var heroArray = [{
  name: "Wolverine",
  img: "assets/images/wolverine200x150.jpg",
  healthPoints: 170,
  attackPower: 9,
  attackPowerInc: 9,
  counterAttackPower: 10
},
  {
  name: "Captian America",
  img: "assets/images/captainamerica200x150.jpg",
  healthPoints: 165,
  attackPower: 8,
  attackPowerInc: 8,
  counterAttackPower: 9
},
{
  name: "Gambit",
  img: "assets/images/gambit200x150.jpg",
  healthPoints: 139,
  attackPower: 7,
  attackPowerInc: 7,
  counterAttackPower: 12
},
{
  name: "Spider-Man",
  img: "assets/images/spiderman200x150.jpg",
  healthPoints: 140,
  attackPower: 3,
  attackPowerInc: 3,
  counterAttackPower: 16
}];

// game function on document
$(document).ready(function() {

  // initial load of the heroArray object
  for (var i = 0; i < heroArray.length; i++) {
    myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>"
    + heroArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src="
    + heroArray[i].img + "></div><p class='health'</p>" + "health: " + heroArray[i].healthPoints + "</div>";
  }

  $(".first-container").html(myHTML);

    // event listener on click
    $("body").on("click", ".outer-img-container", function(event){

      // sets click counter equal to zero if player has not yet slected hero
      if (clickCounter === 0) {
      $(".instructions").css("display", "none");
      $(".show-and-hide").css("visibility", "visible");
      playerId = $(this).attr("id");

      // adds class hero to player choice
      $(this).addClass("hero");

      // adds class enemy to all otehr heroes
      $(this).siblings('div').addClass("enemy");

      // stores previous this (my enemy calss) into opponents variable
      var opponents = $(this).siblings('div').detach();

      // stores player hero into player variable
      var player = $(this).detach();

      // appends player variable with your-character class in query selector
      $(".your-character").append(player);

      //append opponents variable into with enemies class
      $(".enemies").append(opponents);

      // increments clicks on clickCounter
      clickCounter++;
      }
    });

    $("body").on("click", "div.enemy", function(){

      // sets equal to 0 if enemy hasn't been selected yet
      if (defenderOccupancyCounter === 0) {

        // holds the defender in the defenderID variable
        defenderId = $(this).attr("id");
        $(this).addClass("currentDefender");

        // detaches current enemy and stores it in currentEnemy variable
        var currentEnemy = $(this).detach();

        // appends selected enemy with defender class
        $(".defender").append(currentEnemy);

        // increments DefenderOccupanceCounter variable
        defenderOccupancyCounter++;
      }
    });

    $("body").on("click", ".attack-button", function(){

      // if the defender spot is not occupied, attack-button will not trigger an action
      if (defenderOccupancyCounter === 1) {

        // when the attack button is clicked, player hp is damaged by amount of def counterattack
        heroArray[playerId].healthPoints = heroArray[playerId].healthPoints - heroArray[defenderId].counterAttackPower;

        // def health is damaged by amount of player hero attack
        heroArray[defenderId].healthPoints = heroArray[defenderId].healthPoints - heroArray[playerId].attackPower;

        // selects the div class hero with child p tag that has the health class then updates html
        if ( heroArray[playerId].healthPoints > -1) {
          $("div.hero > p.health").html("health: " + heroArray[playerId].healthPoints);
        } else {
            heroArray[playerId].healthPoints = 0;
            $("div.hero > p.health").html("health: " + heroArray[playerId].healthPoints);
        }

        // selects div class urrentDefender with child p tag that has the health class then updates html
        if( heroArray[defenderId].healthPoints > -1) {
          $("div.currentDefender > p.health").html("health: " + heroArray[defenderId].healthPoints);
        } else {
            heroArray[defenderId].healthPoints = 0;
            $("div.currentDefender > p.health").html("health: " + heroArray[defenderId].healthPoints);
        }

        $(".hero-status").html("Hero Status: You attacked " + heroArray[defenderId].name + " for " + heroArray[playerId].attackPower + " damage!");
        $(".defender-status").html("Enemy Status: " + heroArray[defenderId].name + " attacked you for " + heroArray[defenderId].counterAttackPower + " damage!");

        // if player dies, resets game
        checkIfPlayerLost();

        // removes defeated opponent when killed
        removeDefeatedDefender();

        // attack power is increased with each attack
        heroArray[playerId].attackPower = heroArray[playerId].attackPower + heroArray[playerId].attackPowerInc;
      }
    });

    $("body").on("click", ".restart-button", function() {

      defenderOccupancyCounter = 0;

      // hides select your character instructions, repeats on reset
      $(".instructions").css("display", "initial");
      $(".your-character").empty();
      $(".your-character").append("<h3 class='show-and-hide'>Your Hero</h3>");
      $(".enemies").empty();
      $(".enemies").append("<h3 class='show-and-hide'>Enemies Available To Attack</h3>");
      $(".defender").empty();
      $(".defender-status").html("Enemy Status: ");
      $(".hero-status").html("Hero Status: ");

      myHTML = [];

      for (var j = 0; j < heroArray.length; j++) {
        heroArray[j].healthPoints = healthPointsArray[j];
        heroArray[j].attackPower = originalAttackPowerArray[j];
      }

      for (var i = 0; i < heroArray.length; i++) {
        myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>"
        + heroArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src="
        + heroArray[i].img + "></div><p class='health'</p>" + "health: " + heroArray[i].healthPoints + "</div>";
      }

      clickCounter = 0;
      $(".first-container").html(myHTML);
    });
});

// function checks if player has died
function checkIfPlayerLost() {

  if(heroArray[playerId].healthPoints < 1) {

    defenderOccupancyCounter = 0;
    victoryCounter = 0;

    alert("You've been vanquished!");

    $(".defender-status").html("Enemy Status: ");
    $(".hero-status").html("Hero Status: ");
    $(".instructions").css("display", "initial");
    $(".your-character").empty();
    $(".your-character").append("<h3 class='show-and-hide'>Your Hero</h3>");
    $(".enemies").empty();
    $(".enemies").append("<h3 class='show-and-hide'>Enemies Available to Attack</h3>");
    $(".defender").empty();

    myHTML = [];

    for (var j = 0; j < heroArray.length; j++) {
      heroArray[j].healthPoints = healthPointsArray[j];
      heroArray[j].attackPower = originalAttackPowerArray[j];
    }

    for (var i = 0; i < heroArray.length; i++) {
      myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>"
      + heroArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src="
      + heroArray[i].img + "></div><p class='health'</p>" + "health: " + heroArray[i].healthPoints + "</div>";
    }

    clickCounter = 0;
    $(".first-container").html(myHTML);
  }

  // pllays audio for the clip Marvel Theme
  $("#marvelTheme").get(0).play();
}

// function removes defeated opponent removeDefeatedDefender
function removeDefeatedDefender() {

  if(heroArray[defenderId].healthPoints < 1) {
    alert("The enemy has been vanquished!");

    $(".defender-status").html("Enemy Status: ");
    $(".hero-status").html("Hero Status: ");
    $(".currentDefender").remove();

    defenderOccupancyCounter = 0;
    victoryCounter++;

    if (victoryCounter === 3) {
      alert("You are the Ultimate Marvel Hero!");
    }
  }
}
