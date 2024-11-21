export default function dateTimeConvert(dateTimeString) {
    const date = new Date(dateTimeString);

    // Format the date part
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    // Format the time part
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    let formattedDateTime;
    // Combine date and time
    if (hours !== "00") {
        formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    } else {
        formattedDateTime = `${year}-${month}-${day}`;
    }
    return formattedDateTime;
}

export function getToday() {
    return new Date();
}

export function getOneWeekFromToday() {
    return new Date(getToday().setDate(getToday().getDate() + 7));
}

export function getOneDayBeforeToday() {
    return new Date(getToday().setDate(getToday().getDate() - 1));
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

export function calculateDateByDistance(distance) {
    // Divide distance by 100 to get the number of days to add
    const daysToAdd = Math.floor(distance / 100);

    // Create a new date and add the days
    const newDate = getOneWeekFromToday();
    newDate.setDate(newDate.getDate() + daysToAdd);

    return newDate;
}