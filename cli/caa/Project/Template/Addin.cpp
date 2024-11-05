#include "__ADDIN_NAME__.h"

#include "CATCommandHeader.h"
MacDeclareHeader(__ADDIN_NAME__Header);
CATImplementClass(__ADDIN_NAME__, Implementation, CATBaseUnknown, CATnull);

__ADDIN_NAME__::__ADDIN_NAME__() : CATBaseUnknown()
{
}

__ADDIN_NAME__::~__ADDIN_NAME__()
{
}

void __ADDIN_NAME__::CreateCommands()
{
}

CATCmdContainer *__ADDIN_NAME__::CreateToolbars()
{
    NewAccess(CATCmdContainer, toolbar, toolbar);
    AddToolbarView(toolbar, 1, Top);
    return toolbar;
}

// TIE or TIEchain definitions
#include "TIE_CATIAfrGeneralWksAddin.h"
TIE_CATIAfrGeneralWksAddin(__ADDIN_NAME__);

// Methods implementation