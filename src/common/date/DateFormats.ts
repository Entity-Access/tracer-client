import DateTime from "@web-atoms/date-time/dist/DateTime";

const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
];

export const DateFormats = {
    diff(d: Date | DateTime) {
        if (!d) {
            return "";
        }
        if (!(d instanceof DateTime)) {
            d = typeof d === "string" ? new DateTime(d) : DateTime.from(d);
        }
        const today = DateTime.now;
        let diff = today.diff(d);

        if (diff.totalMilliseconds < 0) {
            // this is in future...
            diff = d.diff(today);
        }

        if (diff.totalHours <= 24) {
            if (diff.totalSeconds <= 180) {
                return "now";
            }
            if (diff.totalMinutes < 60)  {
                return Math.round(diff.totalMinutes) + "m";
            }
            return Math.round(diff.totalHours) + "h";
        }
        if (diff.totalDays <= 30) {
            return  Math.round(diff.totalDays) + "d";
        }
        if (diff.totalDays <= 365) {
            return  Math.round(diff.totalDays / 30) + "mo";
        }
        return  Math.round(diff.totalDays / 365) + "yr";
    },
    withWeekDayAndTime(d: Date | DateTime | string, def: string = ""): string {
        if (!d) {
            return def;
        }
        d = DateTime.from(d);
        return d?.toLocaleString(navigator.language, {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
            hour12: true,
            minute: "numeric",
            hour: "numeric"
        }) ?? def;
    },
    relative: {
        short(d: Date | DateTime) {
            if (!d) {
                return "";
            }
            d = DateTime.from(d);
            const now = DateTime.now;
            if (now < d) {
                return "in " + DateFormats.diff(d);
            }
            return DateFormats.diff(d) + " ago";
        }
    }
};