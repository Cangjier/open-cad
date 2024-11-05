#ifndef __Addin___H
#define __Addin___H

#include "CATIAfrGeneralWksAddin.h"
#include "CATBaseUnknown.h"
#include "CATCreateWorkshop.h"
#include "CATCmdContainer.h"

class __Addin__ : public CATBaseUnknown
{
  CATDeclareClass;

public:
  __Addin__();
  virtual ~__Addin__();
  void CreateCommands();
  CATCmdContainer *CreateToolbars();

private:
  __Addin__(__Addin__ &);
  __Addin__ &operator=(__Addin__ &);
};

//-----------------------------------------------------------------------

#endif
