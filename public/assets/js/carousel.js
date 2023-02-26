"use strict";

class carouse {
  constructor(el) {
    this.el = el;
    // this.carouseOptions = ["previous", "add", "play", "next"];
    this.carouseOptions = ["previous", "next"];
    this.carouseData = [
      {
        id: "1",
        src: "asset/cover buku terbaru.jpg",
      },
      {
        id: "2",
        src: "asset/cover buku terbaru.jpg",
        // src: "http://fakeimg.pl/300/?text=2",
      },
      {
        id: "3",
        src: "asset/cover buku terbaru.jpg",
        // src: "http://fakeimg.pl/300/?text=3",
      },
      {
        id: "4",
        src: "asset/cover buku terbaru.jpg",
        // src: "http://fakeimg.pl/300/?text=4",
      },
      {
        id: "5",
        src: "asset/cover buku terbaru.jpg",
        // src: "http://fakeimg.pl/300/?text=5",
      },
    ];
    this.carouseInView = [1, 2, 3, 4, 5];
    this.carouseContainer;
    this.carousePlayState;
  }

  mounted() {
    this.setupcarouse();
  }

  // Build carouse html
  setupcarouse() {
    const container = document.createElement("div");
    const controls = document.createElement("div");

    // Add container for carouse items and controls
    this.el.append(container, controls);
    container.className = "carouse-container";
    controls.className = "carouse-controls";

    // Take dataset array and append items to container
    this.carouseData.forEach((item, index) => {
      const carouseItem = item.src ? document.createElement("img") : document.createElement("div");

      container.append(carouseItem);

      // Add item attributes
      carouseItem.className = `carouse-item carouse-item-${index + 1}`;
      carouseItem.src = item.src;
      carouseItem.setAttribute("loading", "lazy");
      // Used to keep track of carouse items, infinite items possible in carouse however min 5 items required
      carouseItem.setAttribute("data-index", `${index + 1}`);
    });

    this.carouseOptions.forEach((option) => {
      const btn = document.createElement("button");
      const axSpan = document.createElement("span");

      // Add accessibilty spans to button
      axSpan.innerText = option;
      axSpan.className = "ax-hidden";
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carouse-control carouse-control-${option}`;
      btn.setAttribute("data-name", option);

      // Add carouse control options
      controls.append(btn);
    });

    // After rendering carouse to our DOM, setup carouse controls' event listeners
    this.setControls([...controls.children]);

    // Set container property
    this.carouseContainer = container;
  }

  setControls(controls) {
    controls.forEach((control) => {
      control.onclick = (event) => {
        event.preventDefault();

        // Manage control actions, update our carouse data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
      };
    });
  }

  controlManager(control) {
    if (control === "previous") return this.previous();
    if (control === "next") return this.next();
    if (control === "add") return this.add();
    if (control === "play") return this.play();

    return;
  }

  previous() {
    // Update order of items in data array to be shown in carouse
    this.carouseData.unshift(this.carouseData.pop());

    // Push the first item to the end of the array so that the previous item is front and center
    this.carouseInView.push(this.carouseInView.shift());

    // Update the css class for each carouse item in view
    this.carouseInView.forEach((item, index) => {
      this.carouseContainer.children[index].className = `carouse-item carouse-item-${item}`;
    });

    // Using the first 5 items in data array update content of carouse items in view
    this.carouseData.slice(0, 5).forEach((data, index) => {
      document.querySelector(`.carouse-item-${index + 1}`).src = data.src;
    });
  }

  next() {
    // Update order of items in data array to be shown in carouse
    this.carouseData.push(this.carouseData.shift());

    // Take the last item and add it to the beginning of the array so that the next item is front and center
    this.carouseInView.unshift(this.carouseInView.pop());

    // Update the css class for each carouse item in view
    this.carouseInView.forEach((item, index) => {
      this.carouseContainer.children[index].className = `carouse-item carouse-item-${item}`;
    });

    // Using the first 5 items in data array update content of carouse items in view
    this.carouseData.slice(0, 5).forEach((data, index) => {
      document.querySelector(`.carouse-item-${index + 1}`).src = data.src;
    });
  }

  add() {
    const newItem = {
      id: "",
      src: "",
    };
    const lastItem = this.carouseData.length;
    const lastIndex = this.carouseData.findIndex((item) => item.id == lastItem);

    // Assign properties for new carouse item
    Object.assign(newItem, {
      id: `${lastItem + 1}`,
      src: `http://fakeimg.pl/300/?text=${lastItem + 1}`,
    });

    // Then add it to the "last" item in our carouseData
    this.carouseData.splice(lastIndex + 1, 0, newItem);

    // Shift carouse to display new item
    this.next();
  }

  play() {
    const playBtn = document.querySelector(".carouse-control-play");
    const startPlaying = () => this.next();

    if (playBtn.classList.contains("playing")) {
      // Remove class to return to play button state/appearance
      playBtn.classList.remove("playing");

      // Remove setInterval
      clearInterval(this.carousePlayState);
      this.carousePlayState = null;
    } else {
      // Add class to change to pause button state/appearance
      playBtn.classList.add("playing");

      // First run initial next method
      this.next();

      // Use play state prop to store interval ID and run next method on a 1.5 second interval
      this.carousePlayState = setInterval(startPlaying, 1500);
    }
  }
}

// Refers to the carouse root element you want to target, use specific class selectors if using multiple carouses
const el = document.querySelector(".carouse");
// Create a new carouse object
const examplecarouse = new carouse(el);
// Setup carouse and methods
examplecarouse.mounted();
