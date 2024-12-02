#include "__FILE_NAME__.h"

#include "CATCreateExternalObject.h"
CATCreateClass(__COMMAND_CLASS_NAME__);

__COMMAND_CLASS_NAME__::__COMMAND_CLASS_NAME__() : CATCommand(NULL, "__COMMAND_CLASS_NAME__")
{
    RequestStatusChange(CATCommandMsgRequestExclusiveMode);
}

__COMMAND_CLASS_NAME__::~__COMMAND_CLASS_NAME__()
{
}

CATStatusChangeRC __COMMAND_CLASS_NAME__::Activate(CATCommand *iFromClient, CATNotification *iEvtDat)
{

    RequestDelayedDestruction();
    return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC __COMMAND_CLASS_NAME__::Desactivate(CATCommand *iFromClient, CATNotification *iEvtDat)
{
    RequestDelayedDestruction();
    return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC __COMMAND_CLASS_NAME__::Cancel(CATCommand *iFromClient, CATNotification *iEvtDat)
{
    RequestDelayedDestruction();
    return (CATStatusChangeRCCompleted);
}
