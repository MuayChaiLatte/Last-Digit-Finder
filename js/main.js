document.querySelector('#clickMe').addEventListener('click', findTheLastDigit)

async function findTheLastDigit() {
  const base = document.querySelector('#base').value;
  const power = document.querySelector('#power').value;
  const res = await fetch(`/api?base=${base}&power=${power}`);
  const data = await res.json();

  document.querySelector('#lastDigitValue').textContent = data.lastDigit;
}