#ifndef __ADDIN_NAME__H
#define __ADDIN_NAME__H

#include "CATIAfrGeneralWksAddin.h"
#include "CATBaseUnknown.h"
#include "CATCreateWorkshop.h"
#include "CATCmdContainer.h"

class __ADDIN_NAME__ : public CATBaseUnknown
{
  CATDeclareClass;

public:
  __ADDIN_NAME__();
  virtual ~__ADDIN_NAME__();
  void CreateCommands();
  CATCmdContainer *CreateToolbars();

private:
  __ADDIN_NAME__(__ADDIN_NAME__ &);
  __ADDIN_NAME__ &operator=(__ADDIN_NAME__ &);
};

//-----------------------------------------------------------------------

#endif
