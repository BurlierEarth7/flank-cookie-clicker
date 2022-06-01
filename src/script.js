var clicks;
var prices;
//defaults
var defPrices = {
  clicker: 50,
  multiplier: 100
}
var defClicks = 0;
var defItems = {
  clicker: 0,
  multiplier: 1
}
//names
var items = {
  clicker: "clicker",
  multiplier: "multiplier"
}

//used for info in shop
var info = {
	clicker: "Adds _ click(s) to your total clicks every 5 seconds\n (Number scales with multiplier and amount, if no clickers bought it says 0)",
	multiplier: "Multiplies your amount of clicks gained when clicking the button\n by _X (Multiplies clickers at 1/5 the amount)",
	gamble: "Gamble any amount of points you desire with\n a chance to win 5x the amount!"
}
//used when help command has no argument
var cheatHelpBasic = {
	setClicks: "Set amount of clicks, see help(\"setClicks\")",
	setItemCount: "Set amount of specified item, see help(\"setItem\")"
}
//used when help command has an argument
var cheatHelpAdv = {
	setClicks: "Sets the amount of clicks to the specified value, e.g. setClicks(100000) will set your clicks to 100000 (it sets it directly to said number, not add)",
	setItemCount: "Sets the amount of the specified item to the specified value, e.g. setItem(\"clicker\", 10000) will set the amount of clickers owned to 10000. item must be in quotations and amount as an integer"
}

//used for updating prices on purchase
var priceUpdates = {
  clicker: 5,
  multiplier: 25
}
var purchasedItems;

window.onload = function loaded() {
	clicks = 0;
  //load save
  if (localStorage.getItem("clicks") == null) {
    resetSave();
  } else {
    if (localStorage.getItem("clicks") != undefined) {
      clicks = parseInt(localStorage.getItem("clicks"))
      localStorage.setItem("clicks", clicks)
    } else {
      localStorage.setItem("clicks", defClicks)
      clicks = parseInt(localStorage.getItem("clicks"))
    }
    purchasedItems = JSON.parse(localStorage.getItem('items'))
    prices = JSON.parse(localStorage.getItem('prices'))
  }

  //end load save

  //setup prices
  Object.keys(prices).forEach(key => {
    if (prices[key] == null) {
      prices[key] == 0
    }
    document.getElementById(`${key}Label`).innerHTML = prices[key] + " Clicks"
  })


  setInterval(updateClicks, 1000 / 30);
  setInterval(autoClick, 5000);
} //end of loaded


//gain clicks
function flankbuttonclicked() {
  clicks += purchasedItems['multiplier'];
}

function updateClicks() {
  //updates click label, and saved progress
  localStorage.setItem("clicks", clicks)
  var yes = localStorage.getItem('items');
  localStorage.setItem('items', JSON.stringify(purchasedItems))
  var yestwo = localStorage.getItem('prices')
  localStorage.setItem('prices', JSON.stringify(prices))
  if (prices == undefined) {
    prices = defPrices;
  }
	

  //anim
  const counters = document.querySelectorAll(".count");
const speed = 800;

counters.forEach((counter) => {
  const updateCount = () => {
    const target = clicks;
	  var count = parseInt(counter.innerText);
	  if (count > clicks) {
		  count = clicks - 1
	  }
    
    var increment = Math.trunc(target / speed);
	 if (increment == 0) increment++;

    if (count < target) {
      counter.innerText = count + increment;
      setTimeout(updateCount, 1);
    } else {
      count.innerText = target;
    }
  };
  updateCount();
});
	updateStats();
}

//auto clicker, used for Clicker item
function autoClick() {
  clicks += purchasedItems['clicker'] * (Math.trunc(purchasedItems['multiplier'] / 5) + 1);
}

//shop
function checkPricing(item, price) {
  clicks >= price ? buyItem(`${item}`, price) : alert(`Insufficient Clicks, you need ${price - clicks} more click(s)!`) 
}

//purchase an item
function buyItem(item, price) {
  clicks -= price;
  purchasedItems[item] += 1;
  updatePricing(`${item}Label`, item, priceUpdates[item])
}

//used for gambling button
function promptGamble() {
	var selectedAmount;
	do {
		selectedAmount = window.prompt("Select the amount to gamble")
		if (selectedAmount != null) {
			selectedAmount = parseInt(selectedAmount)
		} else {
			break
		}
	} while (selectedAmount > clicks || selectedAmount == NaN || selectedAmount < 1)
	if (selectedAmount != null) {
		 gamble(selectedAmount)
	}
}

function gamble(amount) {
	// 1/50 odds
	var rng = Math.floor(Math.random() * (50 - 1 + 1) + 1)
	if (rng == 1) {
		clicks += (amount * 5)
		alert(`You won ${amount * 5} clicks!`)
	} else {
		clicks -= amount
		alert("You did not win.")
	}
}

//Increment price of item after purchase
function updatePricing(labelid, item, amount) {
  //when item has been bought enough times, pricing goes up
  prices[item] = (prices[item] + (purchasedItems[item] * amount))
  document.getElementById(labelid).innerHTML = prices[item] + " Clicks"

}

function updateStats() {
	//updates statistics and gets the info for each item
	
	//update stats
	Object.keys(items).forEach(key => {
    document.getElementById(`stat_${items[key]}`).innerText = `${items[key].replace(items[key].substring(0, 1), items[key].substring(0, 1).toUpperCase())}: ${purchasedItems[key]}`
  })
	
	//update info
	Object.keys(info).forEach(key => {
    document.getElementById(`inftxt_${key}`).innerText = `${info[key].replace("_", purchasedItems[key])}`
  })
}

function askReset() {
	var shouldReset = window.confirm("Are you sure you want to reset your progress? This cannot be undone!");
	if (shouldReset) resetSave();
}

//help command (for cheats)
function help(cmd = null) {
	if (cmd == null) {
		Object.keys(cheatHelpBasic).forEach(key => {
			console.log(`${key}: ${cheatHelpBasic[key]}`)
		})
	} else {
		if (cheatHelpAdv[cmd] === undefined) {
			console.log(`Unknown command ${cmd}`)
		} else {
			console.log(cheatHelpAdv[cmd])
		}
	}
}

//cheats
function setClicks(amount) {
  clicks = amount - 1;
  flankbuttonclicked();
}

function setItemCount(item, count) {
  purchasedItems[item] = count;
}

//reset game
function resetSave() {
  localStorage.clear()
  clicks = 0;
  purchasedItems = defItems;
  prices = defPrices;
  Object.keys(defPrices).forEach(key => {
    document.getElementById(`${key}Label`).innerHTML = prices[key] + " Clicks"
  })
}
