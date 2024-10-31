#include "OyyDemoAddin.h"

#include "CATCommandHeader.h"
MacDeclareHeader(OyyDemoAddinHeader);
CATImplementClass(OyyDemoAddin, Implementation, CATBaseUnknown, CATnull);

OyyDemoAddin::OyyDemoAddin() : CATBaseUnknown()
{
}

OyyDemoAddin::~OyyDemoAddin()
{
}

void OyyDemoAddin::CreateCommands()
{
    new OyyDemoAddinHeader("OyyHeader", "DemoMod", "OyyCmdCls", (void *)NULL, CATFrmAvailable);
}

CATCmdContainer *OyyDemoAddin::CreateToolbars()
{
    NewAccess(CATCmdContainer, pOyyDemoContainer, OyyDemoContainer);
    AddToolbarView(pOyyDemoContainer, 1, Top);

    NewAccess(CATCmdStarter, pOyyCmd, OyyCmd);
    SetAccessCommand(pOyyCmd, "OyyHeader");
    SetAccessChild(pOyyDemoContainer, pOyyCmd);

    return pOyyDemoContainer;
}

// TIE or TIEchain definitions
#include "TIE_CATIAfrGeneralWksAddin.h"
TIE_CATIAfrGeneralWksAddin(OyyDemoAddin);

// Methods implementation