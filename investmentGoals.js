function convertToMonthlyReturnRate() {
    return yearlyReturnRate ** (1 / 12);
}

function generateReturnsArray(
    startingAmount = 0,
    timeHorizon = 0,
    timePeriod = 'monthly',
    monthlyContribuition = 0,
    returnRate = 0,
    returnTimeFrame = 'monthly'
) {
    if (!timeHorizon || !startingAmount) {
        throw new Error("Investimento inicial e prazo devem ser preenchidos");
    }

    const finalReturnRate = retunrTimeFrame === 'monthly' ? 1 + returnRate / 100 : convertToMonthlyReturnRate(1 + returnRate / 100);

    const finalTimeHorizon = timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;
};