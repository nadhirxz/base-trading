let capital, ccapital, percentage, items = [], it = 0;

init();

function init() {
	$('#clear').hide();
	$('#capital').on('change paste keyup', () => {
		$('#capital').removeClass('is-invalid');
		setCapital();
	});
	$('#percentage').on('change paste keyup', () => {
		$('#percentage').removeClass('is-invalid');
		setPercentage();
	});

	setCapital();
	setPercentage();
}

function addInvest() {
	let safe = true;
	if (!capital) {
		$('#capital').addClass('is-invalid');
		safe = false;
	}
	if (!percentage) {
		$('#percentage').addClass('is-invalid');
		safe = false;
	}
	if (safe) {
		let thisItem = it;
		it++;
		let newItem = $(`<div class="row my-3" id="div-${thisItem}"></div>`);
		newItem.html(`
			<div class="col-md-8 col-6 d-flex">
				<button id="x-${thisItem}" type="button" class="mr-3 btn btn-danger">X</button>
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text" id="basic-addon1">Taux</span>
					</div>
					<input id="t-${thisItem}" type="number" min="0" max="100" class="form-control">
				</div>
			</div>
			<div class="col d-flex align-items-center">
				<span id="loss-${thisItem}">Loss</span>
				<label class="switch my-auto mx-2">
					<input id="c-${thisItem}" type="checkbox" checked="true">
					<span class="slider round"></span>
				</label>
				<span id="win-${thisItem}" class="font-weight-bold text-success">Win</span>
			</div>
		`);
		newItem.hide();
		$('#items').append(newItem);
		newItem.fadeIn();

		let item = { id: thisItem, t: 0, win: true }
		items.push(item);

		$(`#x-${thisItem}`).on('click', () => {
			$(`#div-${thisItem}`).fadeOut(200, () => $(this).remove())
			removeItem(item.id);
			setResult();
		});

		$(`#c-${thisItem}`).on('click', () => {
			item.win = !item.win;
			if (item.win) {
				$(`#win-${thisItem}`).addClass('font-weight-bold text-success');
				$(`#loss-${thisItem}`).removeClass();
			} else {
				$(`#win-${thisItem}`).removeClass();
				$(`#loss-${thisItem}`).addClass('font-weight-bold text-danger');
			}
			setResult();
		});

		let typingTimer;
		$(`#t-${thisItem}`).on('change paste keyup', () => {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(() => setResult(), 500);
			$(`#t-${thisItem}`).removeClass('is-invalid');
			item.t = parseFloat($(`#t-${thisItem}`).val()) || 0;
			if (!checkCapital(item.t)) {
				item.t = 0;
				$(`#t-${thisItem}`).addClass('is-invalid');
			}
		});
		$(`#t-${thisItem}`).on('focusout', () => setResult());

		setResult(item.id);
	}
}

function getItem(id) {
	return items.find(e => e.id == id);
}

function removeItem(id) {
	items = items.filter(el => el.id != id);
}

function setCapital() {
	capital = parseFloat($('#capital').val()) || 0;
	setCCapital();
}

function setCCapital(t) {
	ccapital = capital + getProfit(t);
	$('#ccapital').val(format(ccapital));
}

function setPercentage() {
	percentage = parseFloat($('#percentage').val()) || 0;
	setResult();
}

function checkCapital(t) {
	return ((ccapital - t) >= 0);
}

function getProfit(id) {
	let t = 0;
	items.forEach(item => {
		if (item.id != id) {
			if (item.win) t += item.t * (percentage / 100);
			else t -= item.t;
		}
	});
	return t;
}

function setResult(id) {
	setCCapital(id);
	console.log(items)
	let wins = items.filter(e => e.win && e.t).length;
	let profit = getProfit();

	$('#wins').text(wins);
	$('#profit').text(`${profit > 0 ? '+' : ''}` + format(profit.toFixed(2))).removeClass().addClass(profit >= 0 ? 'text-success' : 'text-danger');

	if (items.length == 0) $('#clear').fadeOut();
	else if (items.length == 1) $('#clear').fadeIn();
}

function format(price) {
	return new Intl.NumberFormat().format(price);
}

function clearAll() {
	$('#items').fadeOut(100, () => {
		$('#items').empty();
		$('#items').fadeIn();
	});
	items = [];
	init();
}