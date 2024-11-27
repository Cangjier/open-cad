#ifndef __CLASS_NAME___H
#define __CLASS_NAME___H

#include "CATCommand.h"

class __CLASS_NAME__ : public CATCommand
{
public:
    __CLASS_NAME__();
    virtual ~__CLASS_NAME__();

    virtual CATStatusChangeRC Activate(
        CATCommand *iFromClient,
        CATNotification *iEvtDat);

    virtual CATStatusChangeRC Desactivate(
        CATCommand *iFromClient,
        CATNotification *iEvtDat);

    virtual CATStatusChangeRC Cancel(
        CATCommand *iFromClient,
        CATNotification *iEvtDat);
};
#endif