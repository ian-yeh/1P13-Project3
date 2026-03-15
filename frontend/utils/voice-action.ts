import { useUser } from "@/store/useStore";

interface ScheduleEvent {
    name: string;
    date: Date;
    location: string;
    arrival_time: Date | null;
    departure_time: Date | null;
    user_id: string;
    status: string;
}

function parseTime(text: string | undefined): Date | null {
    if (!text) return null;
    const now = new Date();

    // splitting the word based on space or colon using plain code
    const words: string[] = [];
    let currentWord = "";

    // iterate over each character to extract numbers and letters
    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // if we hit a space or colon, save the word we built so far
        if (char === " " || char === ":") {
            if (currentWord.length > 0) {
                words.push(currentWord);
                currentWord = "";
            }
        } else {
            // otherwise keep adding characters to our current word
            currentWord += char;
        }
    }

    // push the final word if the string didn't end with a space
    if (currentWord.length > 0) {
        words.push(currentWord);
    }

    let hours = -1;
    let minutes = 0;
    let period = "";

    // loop through our separated words to identify hours, mins and am/pm
    for (const word of words) {
        if (word === "am" || word === "pm") period = word;

        else if (!isNaN(Number(word))) {
            if (hours === -1) hours = parseInt(word);
            else minutes = parseInt(word);
        }
    }

    // if no hours were found, we there's no valid time 
    if (hours === -1) return null;

    // convert to 24 hour time format internally
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    const result = new Date(now);
    result.setHours(hours, minutes, 0, 0);

    // if the time has already passed today, schedule for tomorrow
    if (result < now) result.setDate(result.getDate() + 1);

    return result;
}

export function parseVoiceCommand(transcript: string): ScheduleEvent | null {
    const command = transcript.toLowerCase();

    // only proceed if the user says schedule
    if (!command.includes("schedule")) return null;

    // manually split transcripts into an array of words separated by spaces
    const rawWords = command.split(" ");
    const words: string[] = [];

    // filter out any empty string artifacts from double spaces
    for (const w of rawWords) {
        if (w.trim().length > 0) {
            words.push(w.trim());
        }
    }

    let location = "";
    let departureChunk = "";
    let arrivalChunk = "";

    // keeps track of what kind of data we are currently reading
    let section: "location" | "departure" | "arrival" | "none" = "none";

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        // find which descriptor the current word should activate based on keywords 
        // --> could add more generalized keywords or move to a different method cuz rn it don't work too well
        if (word === "to" || (word === "at" && section === "none")) section = "location";
        else if (word === "leaving" || word === "departing" || word === "depart" || word === "leave") section = "departure";
        else if (word === "arriving" || word === "arrive") section = "arrival";
        else if (word === "at" && (section === "departure" || section === "arrival")) continue;
        else if (section === "location") location += (location ? " " : "") + word;
        else if (section === "departure") departureChunk += (departureChunk ? " " : "") + word;
        else if (section === "arrival") arrivalChunk += (arrivalChunk ? " " : "") + word;
    }

    const userData: any = useUser.getState();

    // formatting the final output correctly using parsed logic from earlier
    return {
        name: userData.name || "Mark",
        date: new Date(),
        location: location.trim(),
        arrival_time: parseTime(arrivalChunk) || new Date(),
        departure_time: parseTime(departureChunk) || new Date(),
        user_id: userData.userId || "1",
        status: "pending"
    };
}