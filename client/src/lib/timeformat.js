const timeformat = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const minnutesRemainder = minutes % 60;
    return `${hours}h ${minnutesRemainder}m`;
}
export default timeformat;