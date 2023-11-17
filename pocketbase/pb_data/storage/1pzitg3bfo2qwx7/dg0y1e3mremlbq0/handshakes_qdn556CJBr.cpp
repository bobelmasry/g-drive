#include <iostream>
using namespace std;

int handshake(int n);

int main()
{
    int val;
    val = handshake(1);
    cout << val;
    return 0;
}

int handshake(int n)
{
    int value = 0; // Initialize value to 0

    if (n > 1)
    {
        value += (n + n - 1);
        handshake(n - 1);
    }
    return value;
}