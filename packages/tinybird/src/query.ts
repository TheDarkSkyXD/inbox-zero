import { z } from "zod";
import { tb } from "./client";
import { decrypt, encrypt } from "./encrypt";

export const zodPeriod = z.enum(["day", "week", "month", "year"]);
export type ZodPeriod = z.infer<typeof zodPeriod>;
const zodStartOfPeriod = z.string().transform((t) => new Date(t));
const zodNumberToBoolean = z.number().transform((t) => t === 1);

const getEmailsParameters = z.object({
  ownerEmail: z.string(),
  period: zodPeriod,
  fromDate: z.number().nullish(),
  toDate: z.number().nullish(),
});

const getEmailsData = z.object({
  startOfPeriod: zodStartOfPeriod,
  count: z.number(),
});

export const getEmailsByPeriod = tb.buildPipe({
  pipe: "get_emails_by_period",
  parameters: getEmailsParameters,
  data: getEmailsData,
});

export const getReadEmailsByPeriod = tb.buildPipe({
  pipe: "get_read_emails_by_period",
  parameters: getEmailsParameters,
  data: getEmailsData.merge(z.object({ read: zodNumberToBoolean })),
});

export const getSentEmailsByPeriod = tb.buildPipe({
  pipe: "get_sent_emails_by_period",
  parameters: getEmailsParameters,
  data: getEmailsData,
});

export const getInboxEmailsByPeriod = tb.buildPipe({
  pipe: "get_inbox_emails_by_period",
  parameters: getEmailsParameters,
  data: getEmailsData.merge(z.object({ inbox: zodNumberToBoolean })),
});

export const getMostReceivedFrom = tb.buildPipe({
  pipe: "most_received_from",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    from: z.string().transform(decrypt),
    count: z.number(),
  }),
});
export const getMostSentTo = tb.buildPipe({
  pipe: "most_sent_to",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    to: z.string().transform(decrypt),
    count: z.number(),
  }),
});

export const getDomainsMostReceivedFrom = tb.buildPipe({
  pipe: "get_popular_senders_domains",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    from: z.string().transform(decrypt),
    count: z.number(),
  }),
});
export const getDomainsMostSentTo = tb.buildPipe({
  pipe: "get_popular_recipients_domains",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().nullish(),
    fromDate: z.number().nullish(),
    toDate: z.number().nullish(),
  }),
  data: z.object({
    to: z.string().transform(decrypt),
    count: z.number(),
  }),
});

export const getEmailsFromSender = tb.buildPipe({
  pipe: "emails_from_sender",
  parameters: getEmailsParameters.merge(
    z.object({ fromEmail: z.string().transform(encrypt) }),
  ),
  data: getEmailsData,
});

export const getEmailActionsByDay = tb.buildPipe({
  pipe: "get_email_actions_by_period",
  parameters: z.object({
    ownerEmail: z.string(),
  }),
  data: z.object({
    date: z.string(),
    archive_count: z.number(),
    delete_count: z.number(),
  }),
});

export const getSenders = tb.buildPipe({
  pipe: "get_distinct_senders",
  parameters: z.object({
    ownerEmail: z.string(),
    limit: z.number().optional().default(100),
    offset: z.number().optional().default(0),
  }),
  data: z.object({
    from: z.string().transform(decrypt),
  }),
});
