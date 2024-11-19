//BomCheckIn

// Mandatory UF Includes
#include <uf.h>
#include <uf_object_types.h>

// Internal Includes
#include <NXOpen/ListingWindow.hxx>
#include <NXOpen/NXMessageBox.hxx>
#include <NXOpen/UI.hxx>

// Internal+External Includes
#include <NXOpen/Annotations.hxx>
#include <NXOpen/Assemblies_Component.hxx>
#include <NXOpen/Assemblies_ComponentAssembly.hxx>
#include <NXOpen/Body.hxx>
#include <NXOpen/BodyCollection.hxx>
#include <NXOpen/Face.hxx>
#include <NXOpen/Line.hxx>
#include <NXOpen/NXException.hxx>
#include <NXOpen/NXObject.hxx>
#include <NXOpen/Part.hxx>
#include <NXOpen/PartCollection.hxx>
#include <NXOpen/Session.hxx>

// Std C++ Includes
#include <iostream>
#include <sstream>

using namespace NXOpen;
using std::string;
using std::exception;
using std::stringstream;
using std::endl;
using std::cout;
using std::cerr;

//------------------------------------------------------------------------------
// Open C error handling
//------------------------------------------------------------------------------
#define UF_CALL(X) (report_error( __FILE__, __LINE__, #X, (X)))
int report_error(char* file, int line, char* call, int code)
{
	if (code)
	{

		stringstream errmsg;
		errmsg << "Error " << code << " in " << file << " at line " << line << endl;
		errmsg << call << endl;
		UI::GetUI()->NXMessageBox()->Show("Open C Error", NXOpen::NXMessageBox::DialogTypeError, errmsg.str().c_str());
		throw NXOpen::NXException::Create(code);
	}
	return(code);
}

//------------------------------------------------------------------------------
// NXOpen c++ test class 
//------------------------------------------------------------------------------
class Program
{
	// class members
public:
	static NXOpen::Session* theSession;
	static UI* theUI;

	Program();
	~Program();

	void do_it();
	void print(const NXString&);
	void print(const string&);
	void print(const char*);

private:
	BasePart* workPart, * displayPart;
	NXMessageBox* mb;
	ListingWindow* lw;
	LogFile* lf;
};

//------------------------------------------------------------------------------
// Initialize static variables
//------------------------------------------------------------------------------
NXOpen::Session* (Program::theSession) = NULL;
UI* (Program::theUI) = NULL;

//------------------------------------------------------------------------------
// Constructor 
//------------------------------------------------------------------------------
Program::Program()
{
	// Initialize the Open C API environment */
	UF_CALL(UF_initialize());

	// Initialize the NX Open C++ API environment
	Program::theSession = NXOpen::Session::GetSession();
	Program::theUI = UI::GetUI();
	mb = theUI->NXMessageBox();
	lw = theSession->ListingWindow();
	lf = theSession->LogFile();

	workPart = theSession->Parts()->BaseWork();
	displayPart = theSession->Parts()->BaseDisplay();

}

//------------------------------------------------------------------------------
// Destructor
//------------------------------------------------------------------------------
Program::~Program()
{
	UF_CALL(UF_terminate());
}

//------------------------------------------------------------------------------
// Print string to listing window or stdout
//------------------------------------------------------------------------------
void Program::print(const NXString& msg)
{
	if (!lw->IsOpen()) lw->Open();
	lw->WriteLine(msg);
}
void Program::print(const string& msg)
{
	if (!lw->IsOpen()) lw->Open();
	lw->WriteLine(msg);
}
void Program::print(const char* msg)
{
	if (!lw->IsOpen()) lw->Open();
	lw->WriteLine(msg);
}


#include <vector>
#include <unordered_map>
#include <string>
#include <NXOpen/PartSaveStatus.hxx>

//------------------------------------------------------------------------------
// Entry point(s) for unmanaged internal NXOpen C/C++ programs
//------------------------------------------------------------------------------
//  Explicit Execution
extern "C" DllExport void ufusr(char* parm, int* returnCode, int rlen)
{
	UF_CALL(UF_initialize());
	try
	{
		
	}
	catch (const NXException& e1)
	{
		UI::GetUI()->NXMessageBox()->Show("NXException", NXOpen::NXMessageBox::DialogTypeError, e1.Message());
	}
	catch (const exception& e2)
	{
		UI::GetUI()->NXMessageBox()->Show("Exception", NXOpen::NXMessageBox::DialogTypeError, e2.what());
	}
	catch (...)
	{
		UI::GetUI()->NXMessageBox()->Show("Exception", NXOpen::NXMessageBox::DialogTypeError, "Unknown Exception.");
	}
	UF_CALL(UF_terminate());
}


//------------------------------------------------------------------------------
// Unload Handler
//------------------------------------------------------------------------------
extern "C" DllExport int ufusr_ask_unload()
{
	// Unloads the image when the application completes
	return (int)NXOpen::Session::LibraryUnloadOptionImmediately;

}


