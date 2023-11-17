#include <iostream>
using namespace std;

void addFive(int &num);
int main()
{
    int num2;
    cout << "enter a number: ";
    cin >> num2;
    addFive(num2);
    cout << num2;
    return 0;
}

void addFive(int &num)
{
    num += 5;

    return;
}