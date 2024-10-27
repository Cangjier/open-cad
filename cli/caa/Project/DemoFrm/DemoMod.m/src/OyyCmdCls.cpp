#include "OyyCmdCls.h"

#include "CATCreateExternalObject.h"
CATCreateClass(OyyCmdCls);

OyyCmdCls::OyyCmdCls() : CATCommand(NULL, "OyyCmdCls")
{
  RequestStatusChange(CATCommandMsgRequestExclusiveMode);
}

OyyCmdCls::~OyyCmdCls()
{
}

CATStatusChangeRC OyyCmdCls::Activate(CATCommand *iFromClient, CATNotification *iEvtDat)
{
  
  RequestDelayedDestruction();
  return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC OyyCmdCls::Desactivate(CATCommand *iFromClient, CATNotification *iEvtDat)
{
  RequestDelayedDestruction();
  return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC OyyCmdCls::Cancel(CATCommand *iFromClient, CATNotification *iEvtDat)
{
  RequestDelayedDestruction();
  return (CATStatusChangeRCCompleted);
}
