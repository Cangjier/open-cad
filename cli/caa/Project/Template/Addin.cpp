#include "__Addin__.h"

#include "CATCommandHeader.h"
MacDeclareHeader(__Addin__Header);
CATImplementClass(__Addin__, Implementation, CATBaseUnknown, CATnull);

__Addin__::__Addin__() : CATBaseUnknown()
{
}

__Addin__::~__Addin__()
{
}

void __Addin__::CreateCommands()
{
}

CATCmdContainer *__Addin__::CreateToolbars()
{
    NewAccess(CATCmdContainer, toolbar, toolbar);
    AddToolbarView(toolbar, 1, Top);
    return toolbar;
}

// TIE or TIEchain definitions
#include "TIE_CATIAfrGeneralWksAddin.h"
TIE_CATIAfrGeneralWksAddin(__Addin__);

// Methods implementation