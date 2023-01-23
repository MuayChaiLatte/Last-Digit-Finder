HOW TO USE
    1. Enter an appropriate base and power into the appropriate inputs
    2. Click the clickme
    3. Be amazed as before your very eyes the last digit of your exponent is calculated and displayed, no matter how large the number! (within reason!)

STRUCTURE
    The desired base and power are sent to the server by the client.
    The server then handles the calculation and sends a response back to the client containing the correct digit

LAST DIGIT OF EXPONENT CALCULATION EXPLANATION
    The last digit of any base raised to any power will cycle through a relatively small set of values.
    e.g. with base = 2: lastDigit(2^1) = 2, lastDigit(2^2) = 4, lastDigit(2^3) = 8, lastDigit(2^4) = 6, lastDigit(2^5) = 2...
    
    Therefore the last digit of any exponent can be found by finding the last digit cycle.
    By using BigInt to account for very large powers, the remainder of the power divided by the number of last digit cycle members indicates which last digit the exponent will have.
*/    