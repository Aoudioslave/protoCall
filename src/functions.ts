import {Call} from "./__cached__/__types__";
import {CallsGroupByDate} from "./type";

export const groupByDate = (data: any) => {
    const groupCallsByDate = data.reduce((groups: any, call: Call) => {
        const date = call.created_at.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(call);
        return groups;
    }, {});


    const callsGroupByDate = Object.keys(groupCallsByDate).map((date) => {
        return {
            date,
            calls: groupCallsByDate[date]
        };
    });

    return callsGroupByDate.sort(sortByDate)

}

export const sortByDate =  (a:CallsGroupByDate, b: CallsGroupByDate) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA > dateB ? 1 : -1;
};