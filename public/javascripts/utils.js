function getDateDiff(timePosted) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timePost = new Date(timePosted);
    const day = days[timePost.getDay()];
    return day + ' ' + timePost.getDate() + '/' + (timePost.getMonth() + 1) + '/' + timePost.getFullYear();
}