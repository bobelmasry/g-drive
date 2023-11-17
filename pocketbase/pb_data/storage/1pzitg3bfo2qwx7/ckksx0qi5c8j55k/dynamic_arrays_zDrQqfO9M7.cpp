#include <iostream>
using namespace std;
int main()
{
    typedef int *intPtr;
    intPtr *arr = new intPtr[10];
    for (int i = 0; i < 5; i++)
    {
        arr[i] = new int; // Allocate memory for each element
        *arr[i] = i + 1;  // Initialize the value (e.g., 1, 2, 3, 4, 5)
    }
    for (int i = 0; i < 5; i++)
    {
        cout << *arr[i];
    }
    return 0;
}