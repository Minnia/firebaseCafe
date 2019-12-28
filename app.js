const cafeList = document.querySelector("#cafe-list");
const cafeForm = document.querySelector("#add-cafe-form");

//Create element and render café
function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let deleteButton = document.createElement("div");
  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  deleteButton.textContent = "X";
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(deleteButton);
  cafeList.appendChild(li);

  //Deleting data
  deleteButton.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes")
      .doc(id)
      .delete();
  });
}

//Saving data
cafeForm.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("cafes").add({
    name: cafeForm.name.value,
    city: cafeForm.city.value
  });
  cafeForm.name.value = "";
  cafeForm.city.value = "";
});

// //Getting data
// db.collection("cafes")
//   .orderBy("city")
//   //   .where("city", "==", "Stockholm")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   });

//Real-time listener
db.collection("cafes")
  .orderBy("city")
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
