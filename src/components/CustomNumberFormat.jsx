import React from "react";

const tooltip_format = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6
});
const format1 = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 3
});
const format10 = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 2
});
const format100 = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 1
});
const format1000 = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0
});
const default_format = new Intl.NumberFormat('de-DE', {
    maximumFractionDigits: 0
});

function CustomNumberFormat(props) {
    const number = props.children;
    const abs = Math.abs(number)
    let format = number;

    if (abs < 1) {
        format = format1.format(number);
    } else if (abs < 10) {
        format = format10.format(number);
    } else if (abs < 100) {
        format = format100.format(number);
    } else if (abs < 1000) {
        format = format1000.format(number);
    } else if (abs < 10000) {
        format = format10.format(number / 1000) + 'k';
    } else if (abs < 100000) {
        format = format100.format(number / 1000) + 'k';
    } else if (abs < 1000000) {
        format = format1000.format(number / 1000) + 'k';
    } else if (abs < 10000000) {
        format = format10.format(number / 1000000) + 'm';
    } else if (abs < 100000000) {
        format = format100.format(number / 1000000) + 'm';
    } else if (abs < 1000000000) {
        format = format1000.format(number / 1000000) + 'm';
    } else {
        format = default_format.format(number / 1000000) + 'm';
    }

    return <span title={tooltip_format.format(number)}>{format}{props.suffix}</span>
}

export default CustomNumberFormat;