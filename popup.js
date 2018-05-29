document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('buttons').addEventListener('click', main);   
    document.getElementById('settings').addEventListener('click', setting);             
});
function main() {

    chrome.storage.sync.get(['partnerUserID', 'partnerUserSecret', 'email'], function(data) {
        var partnerUserID = data.partnerUserID;
        var partnerUserSecret = data.partnerUserSecret;
        var email = data.email;
        // by week
        var week_start = document.getElementsByName("start-date")[0].value;
        var week_duration = Number(document.getElementsByName("duration")[0].value);
        var report_id = Number(document.getElementsByName("report-number")[0].value);

        week_start_split = week_start.split('-');
        console.log(week_start_split);

        var transactionList = [];
        for (let i=0; i < week_duration; i++) {
            var date = new Date(Number(week_start_split[0]), Number(week_start_split[1]) - 1, Number(week_start_split[2]) + i);
            transactionList.push({'created': date.toISOString().slice(0,10),'currency': 'USD','merchant': 'Misc','amount': 400, 'category': 'Misc', 'reportID': report_id});
            transactionList.push({'created': date.toISOString().slice(0,10),'currency': 'USD','merchant': 'Phone','amount': 1000, 'category': 'Communication', 'reportID': report_id});        
        }
        var transactionList = JSON.stringify(transactionList);
        var data = {
            'requestJobDescription': '{"type":"create","credentials":{"partnerUserID":' + partnerUserID +', "partnerUserSecret":' + partnerUserSecret + '},"inputSettings":{"type":"expenses","employeeEmail":' + email +',"transactionList":' + transactionList + '}}'
        };
        console.log('data ', data);
        $.ajax({
            type: "POST",
            url: 'https://integrations.expensify.com/Integration-Server/ExpensifyIntegrations',
            data: data,
            success:function(response) {
                if (response) {
                    document.getElementById("result").innerHTML = "Success!";
                }
            },
        });    
    });

}

function setting() {
    chrome.storage.sync.set({ 
        partnerUserID: document.getElementsByName("partnerUserID")[0].value,
        partnerUserSecret: document.getElementsByName("partnerUserSecret")[0].value,
        email: document.getElementsByName("email")[0].value                
    }, function() {
        console.log('saved')
    });
}

