
const gallery = document.querySelector("#gallery");

async function main() {
    const response = await fetch('/api/paintings');
    const paintings = await response.json();

    for (const painting of paintings) {
        const card = document.createElement("article");

        const image = document.createElement("img");
        image.src = painting.image;
        image.alt = painting.title;

        const title = document.createElement("h2");
        title.textContent = painting.title;

        const artist = document.createElement("p");
        artist.textContent = painting.artist;

        const date = document.createElement("p");
        date.textContent = painting.date;

        card.append(image, title, artist, date);
        gallery.append(card);
    }
}

main().catch(console.error);
