#ifdef  _WINDOWS_SOURCE
#ifdef  __DemoFrm
#define ExportedByDemoFrm     __declspec(dllexport)
#else
#define ExportedByDemoFrm     __declspec(dllimport)
#endif
#else
#define ExportedByDemoFrm
#endif