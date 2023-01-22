document.querySelector('#clickMe').addEventListener('click', findTheLastDigit)

async function makeReq(){

  const userName = document.querySelector("#userName").value;
  const res = await fetch(`/api?student=${userName}`)
  const data = await res.json()

  console.log(data);
  document.querySelector("#personName").textContent = data.name
  document.querySelector("#personStatus").textContent = data.status
  document.querySelector("#personOccupation").textContent = data.currentOccupation
}

async function findTheLastDigit() {
  const base = document.querySelector('#base').value;
  const power = document.querySelector('#power').value;
  const res = await fetch(`/api?base=${base}&power=${power}`);
  const data = await res.json();

  document.querySelector('#lastDigitValue').textContent = data.lastDigit;
}