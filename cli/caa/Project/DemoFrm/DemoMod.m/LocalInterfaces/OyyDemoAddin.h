#ifndef OyyDemoAddin_H
#define OyyDemoAddin_H

#include "CATIAfrGeneralWksAddin.h"
#include "CATBaseUnknown.h"
#include "CATCreateWorkshop.h"
#include "CATCmdContainer.h"

class OyyDemoAddin : public CATBaseUnknown
{
  CATDeclareClass;

public:
  OyyDemoAddin();
  virtual ~OyyDemoAddin();
  void CreateCommands();
  CATCmdContainer *CreateToolbars();

private:
  OyyDemoAddin(OyyDemoAddin &);
  OyyDemoAddin &operator=(OyyDemoAddin &);
};

//-----------------------------------------------------------------------

#endif
